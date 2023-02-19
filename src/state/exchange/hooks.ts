import { useWeb3React } from "@web3-react/core"
import JSBI from "jsbi"
import { useCallback } from "react"
import type { TransactionResponse } from '@ethersproject/providers'

import { useCoreContract, useProjectContract } from "../../hooks/useContract"
import { calculateGasMargin } from "../../utils/calculateGasMargin"
import { transactionErrorToUserReadableMessage } from "../../utils/transactionErrorToUserReadableMessage"
import { useTransactionAdder } from "../transactions/hooks"
import { TransactionType } from "../transactions/types"
import { useSingleCallResult } from "../../lib/hooks/multicall"

export function useUtilityTokenAmount(): JSBI | undefined {
    const projectContract = useProjectContract()
    const res = useSingleCallResult(projectContract, 'utilityTokenAmount')
    return res.result && JSBI.BigInt(res.result[0].toString())
}

export function useWithdrawUtilityTokensCallback(): (tokens: JSBI[] | undefined, amount: JSBI | undefined) => undefined | Promise<string> {
    const { account, chainId } = useWeb3React()
    const coreContract = useCoreContract()
    const addTransaction = useTransactionAdder()
    
    
    return useCallback(
      (tokens: JSBI[] | undefined, amount: JSBI | undefined) => {
        
        let ids:number[] = []
        tokens?.map((token)=>{
          ids.push(JSBI.toNumber(token))
        })

        if (!account || !coreContract || !tokens || !ids|| !amount || !chainId) return
        
        console.log(ids)
        return coreContract.estimateGas.withdrawUtilityTokens(ids, {}).then((estimatedGasLimit) => {
          return coreContract
            .withdrawUtilityTokens(ids, { gasLimit: calculateGasMargin(estimatedGasLimit) })
            .then((response: TransactionResponse) => {
              addTransaction(response, {
                type: TransactionType.EXCHANGE,
                projectTokenAmountRaw: tokens.length.toString(),
                currencyAmountRaw: JSBI.multiply(amount, JSBI.BigInt(ids.length)).toString()
              })
              return response.hash
            }).catch((error) => {
              throw new Error(`${transactionErrorToUserReadableMessage(error)}`)
            })
        })
      },
      [account, addTransaction, coreContract, chainId]
    )
}