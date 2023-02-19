import { useWeb3React } from "@web3-react/core"
import JSBI from "jsbi"
import { useCallback } from "react"
import type { TransactionResponse } from '@ethersproject/providers'

import { useCoreContract } from "../../hooks/useContract"
import { useSingleCallResult } from "../../lib/hooks/multicall"
import { calculateGasMargin } from "../../utils/calculateGasMargin"
import { useTransactionAdder } from "../transactions/hooks"
import { TransactionType } from "../transactions/types"
import { transactionErrorToUserReadableMessage } from "../../utils/transactionErrorToUserReadableMessage"

export function useClaimDate(): JSBI | undefined {
    const coreContract = useCoreContract()
    const res = useSingleCallResult(coreContract, 'claimDate')
    return res.result && JSBI.BigInt(res.result[0].toString())
}
export function useDev(): string | undefined {
    const coreContract = useCoreContract()
    const res = useSingleCallResult(coreContract, 'dev')
    return res?.result?.[0].toString()
}

export function useTokensDevRewarded(): JSBI | undefined {
    const coreContract = useCoreContract()
    const res = useSingleCallResult(coreContract, 'tokensDevRewarded')
    return res.result && JSBI.BigInt(res.result[0].toString())
}

export function useTempLock(): boolean | undefined {
    const coreContract = useCoreContract()
    const res = useSingleCallResult(coreContract, 'tempLock')
    return res?.result?.[0]
}

export function useDevShacklesData(): [boolean, string] | undefined {
    const coreContract = useCoreContract()
    const res = useSingleCallResult(coreContract, 'devShacklesData')
    const devShackles = res?.result?.[0]
    const devShacklesMessage = res?.result?.[1]
    return [devShackles, devShacklesMessage]
}

export function useClaimDevRewardCallback(): (amount: string | undefined) => undefined | Promise<string> {
  const { account, chainId, provider } = useWeb3React()
  const addTransaction = useTransactionAdder()

  const coreContract = useCoreContract(true)
  return useCallback(
    (amount) => {
      if (!coreContract || !provider || !chainId || !account || !amount) return undefined
      
      return coreContract.estimateGas.claimDevReward().then((estimatedGasLimit) => {
        return coreContract
          .claimDevReward({ gasLimit: calculateGasMargin(estimatedGasLimit) })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              type: TransactionType.START_FINAL_REWARD,
            })
            return response.hash
          }).catch((error) => {
            throw new Error(`${transactionErrorToUserReadableMessage(error)}`)
          })
      })
    },
    [account, addTransaction, chainId, provider, coreContract]
  )
}

export function useRequestRandomWordsCallback(): () => undefined | Promise<string> {
  const { account, chainId, provider } = useWeb3React()
  const addTransaction = useTransactionAdder()

  const coreContract = useCoreContract(true)
  return useCallback(
    () => {
      if (!coreContract || !provider || !chainId || !account) return undefined
      
      return coreContract.estimateGas.requestRandomWords().then((estimatedGasLimit) => {
        return coreContract
          .requestRandomWords({ gasLimit: calculateGasMargin(estimatedGasLimit) })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              type: TransactionType.REQUEST_RANDOM_WORDS,
              
            })
            return response.hash
          }).catch((error) => {
            throw new Error(`${transactionErrorToUserReadableMessage(error)}`)
          })
      })
    },
    [account, addTransaction, chainId, provider, coreContract]
  )
}

export function useSelectTokensCallback(): () => undefined | Promise<string> {
  const { account, chainId, provider } = useWeb3React()
  const addTransaction = useTransactionAdder()

  const coreContract = useCoreContract(true)
  return useCallback(
    () => {
      if (!coreContract || !provider || !chainId || !account) return undefined
      
      return coreContract.estimateGas.selectTokens().then((estimatedGasLimit) => {
        return coreContract
          .selectTokens({ gasLimit: calculateGasMargin(estimatedGasLimit) })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              type: TransactionType.SELECT_TOKENS,
              
            })
            return response.hash
          }).catch((error) => {
            throw new Error(`${transactionErrorToUserReadableMessage(error)}`)
          })
      })
    },
    [account, addTransaction, chainId, provider, coreContract]
  )
}

export function useDistributeCallback(): () => undefined | Promise<string> {
  const { account, chainId, provider } = useWeb3React()
  const addTransaction = useTransactionAdder()

  const coreContract = useCoreContract(true)
  return useCallback(
    () => {
      if (!coreContract || !provider || !chainId || !account) return undefined
      
      return coreContract.estimateGas.distribute().then((estimatedGasLimit) => {
        return coreContract
          .distribute({ gasLimit: calculateGasMargin(estimatedGasLimit) })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              type: TransactionType.DISTRIBUTE,
              
            })
            return response.hash
          }).catch((error) => {
            throw new Error(`${transactionErrorToUserReadableMessage(error)}`)
          })
      })
    },
    [account, addTransaction, chainId, provider, coreContract]
  )
}

export function useSendProjectFundsCallback(): () => undefined | Promise<string> {
  const { account, chainId, provider } = useWeb3React()
  const addTransaction = useTransactionAdder()

  const coreContract = useCoreContract(true)
  return useCallback(
    () => {
      if (!coreContract || !provider || !chainId || !account) return undefined
      
      return coreContract.estimateGas.sendProjectFunds().then((estimatedGasLimit) => {
        return coreContract
          .sendProjectFunds({ gasLimit: calculateGasMargin(estimatedGasLimit) })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              type: TransactionType.SEND_PROJECT_FUNDS,
              
            })
            return response.hash
          }).catch((error) => {
            throw new Error(`${transactionErrorToUserReadableMessage(error)}`)
          })
      })
    },
    [account, addTransaction, chainId, provider, coreContract]
  )
}

export function usePendingSecondReward(): [JSBI, JSBI] | undefined {
  const coreContract = useCoreContract()
  const res = useSingleCallResult(coreContract, 'pendingSecondReward')
  if(res.result){
    return [JSBI.BigInt(res.result[0].toString()), JSBI.BigInt(res.result[1].toString())]
  }
}

export function useClaimDevSecondRewardCallback(): () => undefined | Promise<string> {
  const { account, chainId, provider } = useWeb3React()
  const addTransaction = useTransactionAdder()

  const coreContract = useCoreContract(true)
  return useCallback(
    () => {
      if (!coreContract || !provider || !chainId || !account) return undefined
      
      return coreContract.estimateGas.claimDevSecondReward().then((estimatedGasLimit) => {
        return coreContract
          .claimDevSecondReward({ gasLimit: calculateGasMargin(estimatedGasLimit) })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              type: TransactionType.CLAIM_SECOND_REWARD,
              
            })
            return response.hash
          }).catch((error) => {
            throw new Error(`${transactionErrorToUserReadableMessage(error)}`)
          })
      })
    },
    [account, addTransaction, chainId, provider, coreContract]
  )
}


export function useRequestDevFinalRewardCallback(): () => undefined | Promise<string> {
  const { account, chainId, provider } = useWeb3React()
  const addTransaction = useTransactionAdder()

  const coreContract = useCoreContract(true)
  return useCallback(
    () => {
      if (!coreContract || !provider || !chainId || !account) return undefined
      
      return coreContract.estimateGas.requestDevFinalReward().then((estimatedGasLimit) => {
        return coreContract
          .requestDevFinalReward({ gasLimit: calculateGasMargin(estimatedGasLimit) })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              type: TransactionType.REQUEST_FINAL_REWARD,
              
            })
            return response.hash
          }).catch((error) => {
            throw new Error(`${transactionErrorToUserReadableMessage(error)}`)
          })
      })
    },
    [account, addTransaction, chainId, provider, coreContract]
  )
}

export function usePendingDevReward(): [JSBI, JSBI] | undefined {
  const coreContract = useCoreContract()
  const res = useSingleCallResult(coreContract, 'pendingDevReward')
  if(res.result){
    return [JSBI.BigInt(res.result[0].toString()), JSBI.BigInt(res.result[1].toString())]
  }
}

export function useClaimDevUtilityRewardCallback(): () => undefined | Promise<string> {
  const { account, chainId, provider } = useWeb3React()
  const addTransaction = useTransactionAdder()

  const coreContract = useCoreContract(true)
  return useCallback(
    () => {
      if (!coreContract || !provider || !chainId || !account) return undefined
      
      return coreContract.estimateGas.claimDevUtilityReward().then((estimatedGasLimit) => {
        return coreContract
          .claimDevUtilityReward({ gasLimit: calculateGasMargin(estimatedGasLimit) })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              type: TransactionType.CLAIM_FINAL_REWARD,
              
            })
            return response.hash
          }).catch((error) => {
            throw new Error(`${transactionErrorToUserReadableMessage(error)}`)
          })
      })
    },
    [account, addTransaction, chainId, provider, coreContract]
  )
}