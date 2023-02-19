import { useWeb3React } from "@web3-react/core"
import JSBI from "jsbi"
import { useCallback } from "react"
import type { TransactionResponse } from '@ethersproject/providers'

import { useCoreContract, useProjectContract } from "../../hooks/useContract"
import { useSingleCallResult } from "../../lib/hooks/multicall"
import { calculateGasMargin } from "../../utils/calculateGasMargin"
import { useTransactionAdder } from "../transactions/hooks"
import { TransactionType } from "../transactions/types"
import { transactionErrorToUserReadableMessage } from "../../utils/transactionErrorToUserReadableMessage"

export function useEmergencyActive(): boolean | undefined {
    const coreContract = useCoreContract()
    const res = useSingleCallResult(coreContract, 'emergencyActive')
    return res?.result?.[0]
}

export function useEmergencyWithdrawalAmount(): JSBI | undefined {
    const coreContract = useCoreContract()
    const res = useSingleCallResult(coreContract, 'emergencyWithdrawalAmount')
    return res.result && JSBI.BigInt(res.result[0].toString())
}

export function useEmergencyWithdrawCallback(): (tokens: JSBI[] | undefined, amount: JSBI | undefined) => undefined | Promise<string> {
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
        return coreContract.estimateGas.emergencyWithdraw(ids, {}).then((estimatedGasLimit) => {
          return coreContract
            .emergencyWithdraw(ids, { gasLimit: calculateGasMargin(estimatedGasLimit) })
            .then((response: TransactionResponse) => {
              addTransaction(response, {
                type: TransactionType.BURN,
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