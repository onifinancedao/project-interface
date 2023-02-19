import JSBI from "jsbi"
import { useCoreContract, useProjectContract } from "../../hooks/useContract"
import { useSingleCallResult } from "../../lib/hooks/multicall"

export function useCurrentStep(): JSBI | undefined {
    const coreContract = useCoreContract()
    const res = useSingleCallResult(coreContract, 'currentStep')
   
    return res.result && JSBI.BigInt(res.result[0].toString())
}

export function useTotalProjectFunds(): JSBI | undefined {
    
    const coreContract = useCoreContract()
    const res = useSingleCallResult(coreContract, 'totalProjectFunds')
   
    return res.result && JSBI.BigInt(res.result[0].toString())
}
export function useUtilityTokenAmount(): JSBI | undefined {
    
    const coreContract = useCoreContract()
    const res = useSingleCallResult(coreContract, 'utilityTokenAmount')
   
    return res.result && JSBI.BigInt(res.result[0].toString())
}
