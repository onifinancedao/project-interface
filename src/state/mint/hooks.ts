import { useWeb3React } from "@web3-react/core"
import JSBI from "jsbi"
import { useCallback } from "react"
import { USD_TOKEN, UTILITY_TOKEN } from "../../constants/tokens"
import { useCoreContract, useProjectContract, useTokenContract } from "../../hooks/useContract"
import { useSingleCallResult } from "../../lib/hooks/multicall"
import { isAddress } from "ethers/lib/utils"
import { calculateGasMargin } from "../../utils/calculateGasMargin"
import { useTransactionAdder } from "../transactions/hooks"
import type { TransactionResponse } from '@ethersproject/providers'
import { TransactionType } from "../transactions/types"
import { transactionErrorToUserReadableMessage } from "../../utils/transactionErrorToUserReadableMessage"
import { CORE_ADDRESS } from "../../constants/addresses"


export function useStartMinting(): JSBI | undefined {
    const coreContract = useCoreContract()
    const res = useSingleCallResult(coreContract, 'startMinting')
    return res.result && JSBI.BigInt(res.result[0].toString())
}

export function useMaxTotalSupply(): JSBI | undefined {
    const projectContract = useProjectContract()
    const res = useSingleCallResult(projectContract, 'maxTotalSupply')
    return res.result && JSBI.BigInt(res.result[0].toString())
}

export function useMintLimit(): JSBI | undefined {
    const coreContract = useCoreContract()
    const res = useSingleCallResult(coreContract, 'mintLimit')
    return res.result && JSBI.BigInt(res.result[0].toString())
}

export function useTotalSupply(): JSBI | undefined {
    const projectContract = useProjectContract()
    const res = useSingleCallResult(projectContract, 'totalSupply')
    return res.result && JSBI.BigInt(res.result[0].toString())
}

export function useTokenPrice(): JSBI | undefined {
    const coreContract = useCoreContract()
    const res = useSingleCallResult(coreContract, 'tokenPrice')
    return res.result && JSBI.BigInt(res.result[0].toString())
}

export function useTokenAllowance(): JSBI | undefined {
    const {account} = useWeb3React()
    const usdTokenContract = useTokenContract(USD_TOKEN.address)
    const res = useSingleCallResult(usdTokenContract, 'allowance', [account??UTILITY_TOKEN.address, CORE_ADDRESS])
    return res.result && JSBI.BigInt(res.result[0].toString())
}

export function useMintCallback(): (to: string | undefined, amount: string | undefined) => undefined | Promise<string> {
    const { account, chainId, provider } = useWeb3React()
    const addTransaction = useTransactionAdder()
  
    const coreContract = useCoreContract(true)
    return useCallback(
      (to: string | undefined, amount: string | undefined) => {
        if (!coreContract || !provider || !chainId || !account || !to || !isAddress(to ?? '') || !amount ) return undefined
        
        return coreContract.estimateGas.mint(to, amount,{}).then((estimatedGasLimit) => {
          return coreContract
            .mint(to, amount, { gasLimit: calculateGasMargin(estimatedGasLimit) })
            .then((response: TransactionResponse) => {
              addTransaction(response, {
                type: TransactionType.MINT,
                recipient:to,
                projectTokenAmountRaw: amount,
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