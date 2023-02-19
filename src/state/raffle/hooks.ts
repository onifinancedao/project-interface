import JSBI from "jsbi"
import { useCoreContract, useProjectContract } from "../../hooks/useContract"
import { useSingleCallResult, useSingleContractMultipleData } from "../../lib/hooks/multicall"

const RAFFLE_INDEX = [[0], [1], [2], [3], [4], [5], [6], [7]]
export const RAFFLE_WINNERS = [1,4,30,200,200,200,200,50]

export function useRaffleAmounts(): JSBI[] | undefined{
    const coreContract = useCoreContract()
    const raffleAmountsCallData = useSingleContractMultipleData(coreContract, 'raffleAmounts', RAFFLE_INDEX)
    const raffleAmounts:JSBI[] = new Array(8)
    raffleAmountsCallData.map((raffleAmountsCall, i) => {
        if(raffleAmountsCall?.result){
            raffleAmounts[i] = JSBI.BigInt(raffleAmountsCall.result.toString())
        }
    })
    return raffleAmounts
}

export interface RaffleResults{
    winners: WinnerInfo[]
}
export interface WinnerInfo{
    IDToken: JSBI
    owner: string
    name: string
    evidence: string
}

export function useRaffleResult(raffle:number | undefined, resultIndex:number | undefined): WinnerInfo | undefined{
    
    const coreContract = useCoreContract()
    const res = useSingleCallResult(coreContract, 'raffleResult', [raffle,resultIndex])
    
    if(res.result){
        const winner:WinnerInfo = {
            IDToken: JSBI.BigInt(res.result.IDToken.toString()),
            owner: res.result.owner,
            name: res.result.name,
            evidence: res.result.evidence,
        }
        return winner
    }
    return undefined
    
    //const raffleResultsCallData = useSingleContractMultipleData(projectContract, 'raffleResult', [test])
    //const raffleResults:RaffleResults[] = [];
    
    /*raffleResultsCallData.map((raffleResultCall, i) => {
        console.log(raffleResultCall)
        if(raffleResultCall?.result){
            //console.log(raffleResultCall.result)
            //raffleParticiPantsNumber[i] = Number(raffleParticiPantsNumberCall.result.toString())

        }
    })
    return raffleResults*/
}

export function useVrfRequestId(): JSBI | undefined {
    const coreContract = useCoreContract()
    const res = useSingleCallResult(coreContract, 'vrfRequestId')
    return res.result && JSBI.BigInt(res.result[0].toString())
}

export function useSelectedNextTokens(): boolean | undefined {
    const coreContract = useCoreContract()
    const res = useSingleCallResult(coreContract, 'selectedNextTokens')
    return res?.result?.[0]
}

export function useOngoingRaffle(): JSBI | undefined {
    const coreContract = useCoreContract()
    const res = useSingleCallResult(coreContract, 'ongoingRaffle')
    return res.result && JSBI.BigInt(res.result[0].toString())
}