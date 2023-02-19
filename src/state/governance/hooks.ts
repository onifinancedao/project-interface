import JSBI from "jsbi"
import { useCallback, useMemo } from "react"
import { t } from "@lingui/macro"
import { Interface } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import type { TransactionResponse } from '@ethersproject/providers'
import { toUtf8String, Utf8ErrorFuncs } from '@ethersproject/strings'
import { CurrencyAmount, Token } from "../../sdk-core"
import { useWeb3React } from "@web3-react/core"
import { isAddress } from "@ethersproject/address"

import { useGovernorContract, useProjectContract } from "../../hooks/useContract"
import { useSingleCallResult, useSingleContractMultipleData } from "../../lib/hooks/multicall"
import { useLogs } from '../logs/hooks'
import GOVERNANCE_ABI from '../../abis/governor.json'
import { PROJECT_TOKEN } from "../../constants/tokens"
import { SupportedChainId } from "../../constants/chains"
import { useTransactionAdder } from "../transactions/hooks"
import { calculateGasMargin } from "../../utils/calculateGasMargin"
import { TransactionType } from "../transactions/types"
import { extractProposalDetail } from "../../pages/Governance"
import { transactionErrorToUserReadableMessage } from "../../utils/transactionErrorToUserReadableMessage"

export interface ProposalDetail {
    target: string
    functionSig: string
    callData: string
    value: JSBI;
}

export interface ProposalData {
    id: string
    title: string
    description: string
    proposer: string
    status: ProposalState
    forCount: JSBI
    againstCount: JSBI
    startBlock: number
    endBlock: number
    eta: JSBI
    details: ProposalDetail[]
    votes: FormattedVoteCastLog[]
}

export interface Receipt {
  hasVoted: boolean
  support: boolean
  votes: JSBI
}

export interface CreateProposalData {
    targets: string[]
    values: string[]
    signatures: string[]
    calldatas: string[]
    description: string
}
  
export enum ProposalState {
    UNDETERMINED = -1,
    PENDING,
    ACTIVE,
    CANCELED,
    DEFEATED,
    SUCCEEDED,
    QUEUED,
    EXPIRED,
    EXECUTED,
}

const GovernanceInterface = new Interface(GOVERNANCE_ABI)

// get count of all proposals made in the governor contract
function useProposalCount(): number | undefined {
    const governorContract = useGovernorContract(true)
    const { result } = useSingleCallResult(governorContract, 'proposalCount')
  
    return result?.[0]?.toNumber()
}

interface FormattedProposalLog {
  description: string
  details: { target: string; functionSig: string; callData: string, value: JSBI }[]
}
//emit VoteCast(voter, proposalId, support, votes, reason);
export interface FormattedVoteCastLog {
  voter: string
  proposalId: JSBI
  support: boolean
  votes: JSBI
  reason: string
}

export const FOUR_BYTES_DIR: { [sig: string]: string } = {
    '0x5ef2c7f0': 'setSubnodeRecord(bytes32,bytes32,address,address,uint64)',
    '0x10f13a8c': 'setText(bytes32,string,string)',
    '0xb4720477': 'sendMessageToChild(address,bytes)',
    '0xa9059cbb': 'transfer(address,uint256)',
    '0x095ea7b3': 'approve(address,uint256)',
    '0x7b1837de': 'fund(address,uint256)',
    '0x5e2b1953': 'communityRaffle(tuple(uint,address,string,string)[])',
}

/**
 * Need proposal events to get description data emitted from
 * new proposal event.
 */

function useFormattedProposalCreatedLogs(
    indices: number[][],
    fromBlock?: number,
    toBlock?: number
  ): FormattedProposalLog[] | undefined {

    const contract = useGovernorContract(false)
    // create filters for ProposalCreated events
    const filter = useMemo(() => {
      const filter = contract?.filters?.ProposalCreated()
      if (!filter) return undefined
      return {
        ...filter,
        fromBlock,
        toBlock,
      }
    }, [contract, fromBlock, toBlock])
    const useLogsResult = useLogs(filter)
    
    return useMemo(() => {
      return useLogsResult?.logs
        ?.map((log) => {
          const parsed = GovernanceInterface.parseLog(log).args
          return parsed
        })
        ?.filter((parsed) => indices.flat().some((i) => i === parsed.id.toNumber()))
        ?.map((parsed) => {
          let description!: string
          try {
            description = parsed.description
          } catch (error:any) {
            // replace invalid UTF-8 in the description with replacement characters
            let onError = Utf8ErrorFuncs.replace
  
            description = JSON.parse(toUtf8String(error.error.value, onError)) || ''
          }
          const details = extractProposalDetail(parsed.targets, parsed.signatures, parsed.calldatas, parsed[3])
          return {
            description,
            details, 
          }
        })
    }, [indices, useLogsResult])
}

//emit VoteCast(voter, proposalId, support, votes, reason);
function useFormattedVoteCastLogs(
  indices: number[][],
  fromBlock?: number,
  toBlock?: number
): FormattedVoteCastLog[] | undefined {
  const contract = useGovernorContract(false)
  // create filters for VoteCast events
  const filter = useMemo(() => {
    const filter = contract?.filters?.VoteCast()
    if (!filter) return undefined
    return {
      ...filter,
      fromBlock,
      toBlock,
    }
  }, [contract, fromBlock, toBlock])
  const useLogsResult = useLogs(filter)
  return useMemo(() => {
    return useLogsResult?.logs
      ?.map((log) => {
        const parsed = GovernanceInterface.parseLog(log).args
        return parsed
      })
      ?.filter((parsed) => indices.flat().some((i) => i === parsed.proposalId.toNumber()))
      ?.map((parsed) => {
        let voter = parsed.voter
        let proposalId = JSBI.BigInt(parsed.proposalId.toString())
        let support = parsed.support
        let reason!: string
        let votes = JSBI.BigInt(parsed.votes.toString())
        try {
          reason = parsed.reason
        } catch (error:any) {
          // replace invalid UTF-8 in the description with replacement characters
          let onError = Utf8ErrorFuncs.replace

          reason = JSON.parse(toUtf8String(error.error.value, onError)) || ''
        }
        return {
          voter,
          proposalId,
          support,
          votes,
          reason,
        }
      })
  }, [indices, useLogsResult])
}

function countToIndices(count: number | undefined, skip = 0) {
    return typeof count === 'number' ? new Array(count - skip).fill(0).map((_, i) => [i + 1 + skip]) : []
}

// get data for all past and active proposals
export function useAllProposalData(): { data: ProposalData[]; loading: boolean } {

  const gov = useGovernorContract(true)

  const proposalCount = useProposalCount()

  const govProposalIndexes = useMemo(() => {
    return countToIndices(proposalCount)
  }, [proposalCount])

  const proposals = useSingleContractMultipleData(gov, 'proposals', govProposalIndexes)

  // get all proposal states
  const proposalStates = useSingleContractMultipleData(gov, 'state', govProposalIndexes)

  // get metadata from past events
  const proposalsFormattedLogs = useFormattedProposalCreatedLogs(govProposalIndexes)
  const voteCastFormattedLogs = useFormattedVoteCastLogs(govProposalIndexes)
  
  // early return until events are fetched
  return useMemo(() => {
    const proposalsCallData = [...proposals]
    const proposalStatesCallData = [...proposalStates]
    const formattedProposalsLogs = [...(proposalsFormattedLogs ?? [])]
    const formattedVoteCastLogs = [...(voteCastFormattedLogs ?? [])]

    if (
      proposalsCallData.some((p) => p.loading) ||
      proposalStatesCallData.some((p) => p.loading) ||
      (gov && !formattedProposalsLogs)
    ) {
      return { data: [], loading: true }
    }

    return {
      data: proposalsCallData.map((proposal, i) => {
        const startBlock = parseInt(proposal?.result?.startBlock?.toString())

        let description = formattedProposalsLogs[i]?.description ?? ''

        let title = description?.split(/#+\s|\n/g)[1]
      
        return {
          id: proposal?.result?.id.toString(),
          title: title ?? t`Untitled`,
          description: description ?? t`No description.`,
          proposer: proposal?.result?.proposer,
          status: proposalStatesCallData[i]?.result?.[0] ?? ProposalState.UNDETERMINED,
          forCount: JSBI.BigInt(proposal?.result?.forVotes),
          againstCount: JSBI.BigInt(proposal?.result?.againstVotes),
          startBlock,
          endBlock: parseInt(proposal?.result?.endBlock?.toString()),
          eta: JSBI.BigInt(proposal?.result?.eta),
          details: formattedProposalsLogs[i]?.details,
          votes: formattedVoteCastLogs.filter((voteCast) => JSBI.toNumber(voteCast.proposalId) === proposal?.result?.id.toNumber())
        }
      }),
      loading: false,
    }
  }, [
    proposalsFormattedLogs,
    gov,
    proposalStates,
    proposals,
  ])
}

export function useProposalData(id: string): ProposalData | undefined {
  const { data } = useAllProposalData()
  return data.find((p) => p.id === id)
}

export function useQuorum(): JSBI | undefined {
  const governanceContract = useGovernorContract(true)
  const quorumVotes = useSingleCallResult(governanceContract, 'quorumVotes')?.result?.[0]
  const { chainId } = useWeb3React()

  if (
    !governanceContract ||
    !quorumVotes ||
    chainId !== SupportedChainId.POLYGON
  )
    return undefined

  return JSBI.BigInt(quorumVotes.toString())
}

// get the users delegatee if it exists
export function useUserDelegatee(): string {
  const { account } = useWeb3React()
  const contract = useProjectContract(true)
  const { result } = useSingleCallResult(contract, 'delegates', [account ?? undefined])
  return result?.[0] ?? undefined
}

// gets the users current votes
export function useUserVotes(): { loading: boolean; votes: CurrencyAmount<Token> | undefined } {
  const { account } = useWeb3React()
  const contract = useProjectContract(true)

  // check for available votes
  const { result, loading } = useSingleCallResult(contract, 'getCurrentVotes', [account ?? undefined])
  return useMemo(() => {
    return { loading, votes: result ? CurrencyAmount.fromRawAmount(PROJECT_TOKEN, result?.[0]) : undefined }
  }, [loading, result])
}

// fetch available votes as of block (usually proposal start block)
export function useVotesAsOfBlock(account: string | undefined, block: number | undefined): JSBI | undefined {
  const contract = useProjectContract(true)

  // check for available votes
 const votes = useSingleCallResult(contract, 'getPriorVotes', [account ?? undefined, block ?? undefined])?.result?.[0]?.toString()
  return votes?JSBI.BigInt(votes):undefined
}

export function useDevelopers(account: string | undefined): boolean | undefined {
  const contract = useGovernorContract()

  return useSingleCallResult(contract, 'developers', [account ?? undefined])?.result?.[0]

}
export function useReceipt(proposalId: string | undefined, voter: string | undefined): Receipt | undefined {
  const contract = useGovernorContract()
  // check for available votes
 const result = useSingleCallResult(contract, 'getReceipt', [proposalId ?? undefined, voter ?? undefined])?.result?.[0]
 if(result){
  const receipt: Receipt = {
    hasVoted: result.hasVoted,
    support: result.support,
    votes: JSBI.BigInt(result.votes.toString())
  }
  return receipt
 }else{
  return undefined
 }
}

export function useDelegateCallback(): (delegatee: string | undefined) => undefined | Promise<string> {
  const { account, chainId, provider } = useWeb3React()
  const addTransaction = useTransactionAdder()

  const contract = useProjectContract(true)

  return useCallback(
    (delegatee: string | undefined) => {
      if (!provider || !chainId || !account || !delegatee || !isAddress(delegatee ?? '')) return undefined
      
      if (!contract) throw new Error('No Project Contract!')
      return contract.estimateGas.delegate(delegatee, {}).then((estimatedGasLimit) => {
        return contract
          .delegate(delegatee, { gasLimit: calculateGasMargin(estimatedGasLimit) })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              type: TransactionType.DELEGATE,
              delegatee,
            })
            return response.hash
          }).catch((error) => {
            throw new Error(`${transactionErrorToUserReadableMessage(error)}`)
          })
      })
    },
    [account, addTransaction, chainId, provider, contract]
  )
}

export function useVoteCallback(): (
  proposalId: string | undefined,
  support: boolean | undefined,
  reason: string | undefined,
) => undefined | Promise<string> {
  const { account, chainId } = useWeb3React()
  const governanceContract = useGovernorContract()
  const addTransaction = useTransactionAdder()

  return useCallback(
    (proposalId: string | undefined, support: boolean | undefined, reason: string | undefined) => {
      if (!account || !governanceContract || !proposalId || !chainId || support === undefined ) return
      return governanceContract.estimateGas.castVote(proposalId, support, reason??'', {}).then((estimatedGasLimit) => {
        return governanceContract
          .castVote(proposalId, support, reason??'', { gasLimit: calculateGasMargin(estimatedGasLimit) })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              type: TransactionType.VOTE,
              proposalId: parseInt(proposalId),
              support: support,
              reason: reason??'',
            })
            return response.hash
          }).catch((error) => {
            throw new Error(`${transactionErrorToUserReadableMessage(error)}`)
          })
      })
    },
    [account, addTransaction, governanceContract, chainId]
  )
}

export function useQueueCallback(): (proposalId: string | undefined) => undefined | Promise<string> {
  const { account, chainId } = useWeb3React()
  const governanceContract = useGovernorContract()
  const addTransaction = useTransactionAdder()

  return useCallback(
    (proposalId: string | undefined) => {
      if (!account || !governanceContract || !proposalId || !chainId) return
      return governanceContract.estimateGas.queue(proposalId, {}).then((estimatedGasLimit) => {
        return governanceContract
          .queue(proposalId, { gasLimit: calculateGasMargin(estimatedGasLimit) })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              type: TransactionType.QUEUE,
              proposalId: parseInt(proposalId),
            })
            return response.hash
          }).catch((error) => {
            throw new Error(`${transactionErrorToUserReadableMessage(error)}`)
          })
      })
    },
    [account, addTransaction, governanceContract, chainId]
  )
}

export function useExecuteCallback(): (proposalId: string | undefined, gasLimit: BigNumber | undefined) => undefined | Promise<string> {
  const { account, chainId } = useWeb3React()
  const governanceContract = useGovernorContract()
  const addTransaction = useTransactionAdder()

  return useCallback(
    (proposalId: string | undefined, gasLimit: BigNumber | undefined) => {
      if (!account || !governanceContract || !proposalId || !chainId) return

      if(gasLimit === undefined || gasLimit?.eq(0)){
        return governanceContract.estimateGas.execute(proposalId, {}).then((estimatedGasLimit) => {
          return governanceContract
            .execute(proposalId, { gasLimit: calculateGasMargin(estimatedGasLimit) })
            .then((response: TransactionResponse) => {
              addTransaction(response, {
                type: TransactionType.EXECUTE,
                proposalId: parseInt(proposalId),
              })
              return response.hash
            }).catch((error) => {
              throw new Error(`${transactionErrorToUserReadableMessage(error)}`)
            })
        })
      }else{
        return governanceContract
            .execute(proposalId, { gasLimit: calculateGasMargin(gasLimit) })
            .then((response: TransactionResponse) => {
              addTransaction(response, {
                type: TransactionType.EXECUTE,
                proposalId: parseInt(proposalId),
              })
              return response.hash
            }).catch((error) => {
              throw new Error(`${transactionErrorToUserReadableMessage(error)}`)
            })
      }
    },
    [account, addTransaction, governanceContract, chainId]
  )
}

export function useCancelCallback(): (proposalId: string | undefined) => undefined | Promise<string> {
  const { account, chainId } = useWeb3React()
  const governanceContract = useGovernorContract()
  const addTransaction = useTransactionAdder()

  return useCallback(
    (proposalId: string | undefined) => {
      if (!account || !governanceContract || !proposalId || !chainId) return
      return governanceContract.estimateGas.cancel(proposalId, {}).then((estimatedGasLimit) => {
        return governanceContract
          .cancel(proposalId, { gasLimit: calculateGasMargin(estimatedGasLimit) })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              type: TransactionType.CANCEL,
              proposalId: parseInt(proposalId),
            })
            return response.hash
          }).catch((error) => {
            throw new Error(`${transactionErrorToUserReadableMessage(error)}`)
          })
      })
    },
    [account, addTransaction, governanceContract, chainId]
  )
}

export function useCreateProposalCallback(): (
  createProposalData: CreateProposalData | undefined
) => undefined | Promise<string> {
  const { account, chainId } = useWeb3React()
  const governanceContract = useGovernorContract()
  const addTransaction = useTransactionAdder()

  return useCallback(
    (createProposalData: CreateProposalData | undefined) => {
      if (!account || !governanceContract || !createProposalData || !chainId) return undefined

      return governanceContract.estimateGas.propose(
        createProposalData.targets,
        createProposalData.values,
        createProposalData.signatures,
        createProposalData.calldatas,
        createProposalData.description
        ).then((estimatedGasLimit) => {
        return governanceContract
          .propose(
            createProposalData.targets,
            createProposalData.values,
            createProposalData.signatures,
            createProposalData.calldatas,
            createProposalData.description, 
            { gasLimit: calculateGasMargin(estimatedGasLimit) }
          )
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              type: TransactionType.SUBMIT_PROPOSAL,
            })
            return response.hash
          }).catch((error) => {
            throw new Error(`${transactionErrorToUserReadableMessage(error)}`)
          })
      })
    },
    [account, addTransaction, governanceContract, chainId]
  )
}

export function useLatestProposalId(address: string | undefined): string | undefined {
  const governanceContract = useGovernorContract()
  const res = useSingleCallResult(governanceContract, 'latestProposalIds', [address])
  return res?.result?.[0]?.toString()
}

export function useProposalThreshold(): JSBI | undefined {

  const governanceContract = useGovernorContract()
  const res = useSingleCallResult(governanceContract, 'proposalThreshold')

  if (res?.result?.[0]) {
    return JSBI.BigInt(res.result[0].toString())
  }

  return undefined
}