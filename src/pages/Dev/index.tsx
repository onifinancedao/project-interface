import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import JSBI from 'jsbi'
import ActionButton from '../../components/ActionButton'
import { SimpleCurrencyInputPanel } from '../../components/InputPanel'
import ThemedContainer from '../../components/ThemedContainer'
import { BIG_INT_ZERO } from '../../constants/misc'
import { USD_TOKEN, UTILITY_TOKEN } from '../../constants/tokens'
import { CurrencyAmount } from '../../sdk-core'
import { useClaimDevRewardCallback, useClaimDevSecondRewardCallback, useClaimDevUtilityRewardCallback, useDevShacklesData, useDistributeCallback, useClaimDate, usePendingDevReward, usePendingSecondReward, useRequestDevFinalRewardCallback, useRequestRandomWordsCallback, useSelectTokensCallback, useSendProjectFundsCallback, useTempLock, useTokensDevRewarded, useDev } from '../../state/dev/hooks'
import { useEmergencyActive } from '../../state/emergency/hooks'
import { useTotalSupply } from '../../state/mint/hooks'
import { useOngoingRaffle, useSelectedNextTokens, useVrfRequestId } from '../../state/raffle/hooks'
import { useCurrentStep } from '../../state/roadMap/hooks'
import { useUserLocale } from '../../state/user/hooks'
function AddClaimableBalance() {
    const tokensDevRewarded = useTokensDevRewarded()
    const totalSupply = useTotalSupply()
    const claimable = totalSupply && tokensDevRewarded?JSBI.LT(tokensDevRewarded, totalSupply)?JSBI.subtract(totalSupply, tokensDevRewarded):BIG_INT_ZERO:BIG_INT_ZERO
    const claimDevRewardCallback = useClaimDevRewardCallback()
    return(
        <div className='row'>
            <div className='col-12'>
                <h4><Trans>Add claimable balance</Trans></h4>
            </div>
            <div className='col-12 my-2'><Trans>Reward for minted tokens</Trans></div>
            <div className='col-12 mb-2'>
                <SimpleCurrencyInputPanel value={claimable.toString()} logoUrl={USD_TOKEN.iconUrl || ''} symbol={USD_TOKEN.symbol || ''}/>
            </div>
            <div className='col-12 d-flex justify-content-center'>
                <ActionButton disabled={JSBI.EQ(claimable, BIG_INT_ZERO)} maxWidth='100%' onClick={()=>{claimDevRewardCallback(claimable.toString())}}>{JSBI.GT(claimable, BIG_INT_ZERO)?<Trans>Add balance</Trans>:<Trans>Nothing to claim</Trans>}</ActionButton>
            </div>
        </div>
    )
}

function RandomWords(){
    const requestRandomWordsCallback = useRequestRandomWordsCallback()
    const vrfRequestId = useVrfRequestId()
    return(
        <div className='row'>
            <div className='col-12'>
                <h4><Trans>Request Random Words</Trans></h4>
            </div>
            <div className='col-12 d-flex justify-content-center'>
                <ActionButton disabled={!JSBI.EQ(vrfRequestId, BIG_INT_ZERO)} maxWidth='100%' onClick={requestRandomWordsCallback}>{vrfRequestId && JSBI.EQ(vrfRequestId, BIG_INT_ZERO)?<Trans>Request</Trans>:<Trans>Waiting answer</Trans>}</ActionButton>
            </div>
        </div>
    )
}

function SelectWinners({ongoingRaffle}:{ongoingRaffle: JSBI | undefined}){
    const selectWinnersCallback = useSelectTokensCallback()
    return(
        <div className='row'>
            <div className='col-12'>
                <h4><Trans>Select winners for raffle #{ongoingRaffle?.toString()}</Trans></h4>
            </div>
            <div className='col-12 d-flex justify-content-center'>
                <ActionButton maxWidth='100%' onClick={selectWinnersCallback}><Trans>Select winners</Trans></ActionButton>
            </div>
        </div>
    )
}

function Distribute({ongoingRaffle}:{ongoingRaffle: JSBI | undefined}){
    const distributeCallback = useDistributeCallback()
    
    return(
        <div className='row'>
            <div className='col-12'>
                <h4><Trans>Distribute prizes for raffle #{ongoingRaffle?.toString()}</Trans></h4>
            </div>
            <div className='col-12 d-flex justify-content-center'>
                <ActionButton maxWidth='100%' onClick={distributeCallback}><Trans>Distribute</Trans></ActionButton>
            </div>
        </div>
    )
}

function Raffles() {
    const currentStep = useCurrentStep()
    const selectedNextTokens = useSelectedNextTokens()
    const ongoingRaffle = useOngoingRaffle()
    if(JSBI.GE(currentStep, JSBI.BigInt(2)) && JSBI.LE(currentStep, JSBI.BigInt(8))){
        if(!selectedNextTokens){
            return(
                <SelectWinners ongoingRaffle={ongoingRaffle} />
            )
        }else{
            return(
                <Distribute ongoingRaffle={ongoingRaffle} />
            )
        }
        
    }else{
        return(
            <div className='col-12 text-center'><Trans>Community Raffle</Trans></div>
        )
    }
    
}

function ProjectFunds(){
    const projectFundsCallback = useSendProjectFundsCallback()
    return(
        <div className='col-12'>
            <ActionButton onClick={projectFundsCallback}><Trans>Send project funds</Trans></ActionButton>
        </div>
    )
}

function SecondReward() {
    const claimable = usePendingSecondReward()
    const claimSecondRewardCallback = useClaimDevSecondRewardCallback()
    return(
        <div className='row'>
            <div className='col-12'>
                <h4><Trans>Claim reward</Trans></h4>
            </div>
            <div className='col-12 my-2'><Trans>Second reward, claim {claimable?.[1].toString()??"undefined"} minutes</Trans></div>
            <div className='col-12 mb-2'>
                <SimpleCurrencyInputPanel value={CurrencyAmount.fromRawAmount(USD_TOKEN, claimable?.[0]?.toString()??"0").toSignificant()} logoUrl={USD_TOKEN.iconUrl || ''} symbol={USD_TOKEN.symbol || ''}/>
            </div>
            <div className='col-12 d-flex justify-content-center'>
                <ActionButton disabled={JSBI.EQ(claimable?.[0]??BIG_INT_ZERO, BIG_INT_ZERO)} maxWidth='100%' onClick={()=>{claimSecondRewardCallback()}}>{JSBI.GT(claimable?.[0], BIG_INT_ZERO)?<Trans>Add balance</Trans>:<Trans>Nothing to claim</Trans>}</ActionButton>
            </div>
        </div>
    )
}

function RequestFinalReward(){
    
    const requestFinalRewardCallback = useRequestDevFinalRewardCallback()
    return(
        <div className='col-12 my-4'>
            <ActionButton onClick={requestFinalRewardCallback}><Trans>Request final reward</Trans></ActionButton>
        </div>
    )
}

function StartFinalReward(){
    const claimDate = useClaimDate()
    const BigNow = JSBI.BigInt((new Date().getTime()/1000).toFixed(0))
    const startFinalRewardCallback = useClaimDevRewardCallback()
    const locale = useUserLocale()
    const dateFormat: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
    }

    return(
        <div className='col-12 my-4 text-center'>
            {claimDate && JSBI.GE(claimDate, BigNow) && <span className='text-muted'><Trans>Claim date: {new Date(JSBI.toNumber(claimDate) * 1000).toLocaleString(locale??'en-US', dateFormat)}</Trans></span>}
            <ActionButton disabled={(claimDate && JSBI.GE(claimDate, BigNow))} onClick={()=>{startFinalRewardCallback("0")}}><Trans>Start final reward</Trans></ActionButton>
        </div>
    )
}

function ClaimFinalReward() {
    const claimable = usePendingDevReward()
    const claimRewardCallback = useClaimDevUtilityRewardCallback()
    return(
        <div className='row  my-4'>
            <div className='col-12'>
                <h4><Trans>Claim reward</Trans></h4>
            </div>
            <div className='col-12 my-2'><Trans>Final dev reward, claim {claimable?.[1].toString()??"undefined"} minutes</Trans></div>
            <div className='col-12 mb-2'>
                <SimpleCurrencyInputPanel value={CurrencyAmount.fromRawAmount(UTILITY_TOKEN, claimable?.[0]?.toString()??"0").toSignificant()} logoUrl={UTILITY_TOKEN.iconUrl || ''} symbol={UTILITY_TOKEN.symbol || ''}/>
            </div>
            <div className='col-12 d-flex justify-content-center'>
                <ActionButton disabled={JSBI.EQ(claimable?.[0]??BIG_INT_ZERO, BIG_INT_ZERO)} maxWidth='100%' onClick={()=>{claimRewardCallback()}}>{JSBI.GT(claimable?.[0], BIG_INT_ZERO)?<Trans>Claim OFI tokens</Trans>:<Trans>Nothing to claim</Trans>}</ActionButton>
            </div>
        </div>
    )
}

function FinalReward(){
    const tempLock = useTempLock()
    const currentStep = useCurrentStep()
    if(JSBI.EQ(currentStep, JSBI.BigInt(11))){
        if(!tempLock){
            return(
                <RequestFinalReward/>
            )
            
        }else{
            return(
                <StartFinalReward/>
            )
        }
    }else{
        return(
            <ClaimFinalReward/>
        )
    }
}
export default function Dev() {

    const emergencyActive = useEmergencyActive()
    const devShacklesData = useDevShacklesData()
    const currentStep = useCurrentStep()
    const dev = useDev()
    const { account } = useWeb3React()
    
    if(account && dev && (account === dev)){
        return (
        <div className='row'>
            <div className='col-12 text-center'>
                <Trans>Be honest, everything will turn out well.</Trans>
            </div>
            <div className='col-12 d-flex justify-content-center my-4'>
                <ThemedContainer>
                    { emergencyActive && <Trans>Emergency Active</Trans>}
                    { !emergencyActive && devShacklesData && devShacklesData[0] && <div className='my-4'><Trans>Dev shackles: {devShacklesData[0]}</Trans></div>}
                    { !emergencyActive && devShacklesData && !devShacklesData[0] && currentStep && JSBI.EQ(currentStep, BIG_INT_ZERO) && <AddClaimableBalance/> }
                    { !emergencyActive && currentStep && JSBI.EQ(currentStep, JSBI.BigInt(1)) && <RandomWords/> }
                    { !emergencyActive && currentStep && JSBI.GE(currentStep, JSBI.BigInt(2)) && JSBI.LE(currentStep, JSBI.BigInt(9)) && <Raffles/>}
                    { !emergencyActive && currentStep && JSBI.EQ(currentStep, JSBI.BigInt(10)) && <ProjectFunds/> }
                    { !emergencyActive && currentStep && JSBI.GE(currentStep, JSBI.BigInt(11)) && <SecondReward/> }
                    { currentStep && JSBI.GE(currentStep, JSBI.BigInt(11)) && <FinalReward/> }
                </ThemedContainer>
            </div>
        </div>
    )
    }else{
        return(
            <div className='text-center'><Trans>Dev</Trans></div>
        )
    }
    
}