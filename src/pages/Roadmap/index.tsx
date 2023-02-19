import { Trans } from '@lingui/macro'
import JSBI from 'jsbi'
import ThemedContainer from '../../components/ThemedContainer'
import { BIG_INT_ZERO } from '../../constants/misc'
import { PROJECT_TOKEN, UTILITY_TOKEN } from '../../constants/tokens'
import { useTempLock, useTokensDevRewarded } from '../../state/dev/hooks'
import { useEmergencyActive } from '../../state/emergency/hooks'
import { useMaxTotalSupply, useStartMinting, useTotalSupply } from '../../state/mint/hooks'
import { useSelectedNextTokens, useVrfRequestId } from '../../state/raffle/hooks'
import { useCurrentStep } from '../../state/roadMap/hooks'
import { useUserLocale } from '../../state/user/hooks'

import './index.css'

const RoadmapItemStatus = (item:number) => {
    const currentStep = useCurrentStep()
    const startMinting = useStartMinting()
    const now = JSBI.BigInt((new Date().getTime()/1000).toFixed(0))
    const emergencyActive = useEmergencyActive()
    const tokensDevRewarded = useTokensDevRewarded()
    const totalSupply = useTotalSupply()
    const maxTotalSupply = useMaxTotalSupply()
    const vrfRequestId = useVrfRequestId()
    const selectedNextTokens = useSelectedNextTokens()
    const tempLock = useTempLock()
    
    switch (item) {
        //is-done, current, on-hold, canceled
        case 0:
            if(JSBI.GT(currentStep, BIG_INT_ZERO) || JSBI.GE(now, startMinting)){
                return 'is-done'
            }else if(emergencyActive){
                return 'canceled'
            } else{
                return 'on-hold'
            }
        case 1:
            if(JSBI.GT(currentStep, BIG_INT_ZERO)){
                return 'is-done';
            }else if(emergencyActive){
                return 'canceled';
            } else if(JSBI.EQ(currentStep, BIG_INT_ZERO) && JSBI.GT(tokensDevRewarded, JSBI.BigInt(0))) {
                return 'current';
            } else{
                return 'on-hold';
            }
        case 2:
            if(JSBI.GT(currentStep, JSBI.BigInt(1)) || (totalSupply && JSBI.EQ(totalSupply, maxTotalSupply))){
                return 'is-done';
            }else if(emergencyActive){
                return 'canceled';
            }else{
                return 'on-hold';
            }
        case 3:
            if(JSBI.GT(currentStep, JSBI.BigInt(1))){
                return 'is-done';
            }else if(emergencyActive){
                return 'canceled';
            } else if(vrfRequestId && !JSBI.EQ(vrfRequestId, BIG_INT_ZERO)) {
                return 'current';
            } else{
                return 'on-hold';
            }
        case 4:
            if(JSBI.GT(currentStep, JSBI.BigInt(2))){
                return 'is-done';
            }else if(emergencyActive){
                return 'canceled';
            } else if(selectedNextTokens && JSBI.EQ(currentStep, JSBI.BigInt(2))) {
                return 'current';
            } else{
                return 'on-hold';
            }
        case 5:
            if(JSBI.GT(currentStep, JSBI.BigInt(3))){
                return 'is-done';
            }else if(emergencyActive){
                return 'canceled';
            } else if(selectedNextTokens && JSBI.EQ(currentStep, JSBI.BigInt(3))) {
                return 'current';
            } else{
                return 'on-hold';
            }
        case 6:
            if(JSBI.GT(currentStep, JSBI.BigInt(4))){
                return 'is-done';
            }else if(emergencyActive){
                return 'canceled';
            } else if(selectedNextTokens && JSBI.EQ(currentStep, JSBI.BigInt(4))) {
                return 'current';
            } else{
                return 'on-hold';
            }
        case 7:
            if(JSBI.GT(currentStep, JSBI.BigInt(5))){
                return 'is-done';
            }else if(emergencyActive){
                return 'canceled';
            } else if(selectedNextTokens && JSBI.EQ(currentStep, JSBI.BigInt(5))) {
                return 'current';
            } else{
                return 'on-hold';
            }
        case 8:
            if(JSBI.GT(currentStep, JSBI.BigInt(6))){
                return 'is-done';
            }else if(emergencyActive){
                return 'canceled';
            } else if(selectedNextTokens && JSBI.EQ(currentStep, JSBI.BigInt(6))) {
                return 'current';
            } else{
                return 'on-hold';
            }
        case 9:
            if(JSBI.GT(currentStep, JSBI.BigInt(7))){
                return 'is-done';
            }else if(emergencyActive){
                return 'canceled';
            } else if(selectedNextTokens && JSBI.EQ(currentStep, JSBI.BigInt(7))) {
                return 'current';
            } else{
                return 'on-hold';
            }
        case 10:
            if(JSBI.GT(currentStep, JSBI.BigInt(8))){
                return 'is-done';
            }else if(emergencyActive){
                return 'canceled';
            } else if(selectedNextTokens && JSBI.EQ(currentStep, JSBI.BigInt(8))) {
                return 'current';
            } else{
                return 'on-hold';
            }
        case 11:
            if(JSBI.GT(currentStep, JSBI.BigInt(9))){
                return 'is-done';
            }else if(emergencyActive){
                return 'canceled';
            } else if(JSBI.EQ(currentStep, JSBI.BigInt(9))) {
                return 'current';
            } else{
                return 'on-hold';
            }
        case 12:
            if(JSBI.GT(currentStep, JSBI.BigInt(10))){
                return 'is-done';
            }else if(emergencyActive){
                return 'canceled';
            } else if(JSBI.EQ(currentStep, JSBI.BigInt(10))) {
                return 'current';
            } else{
                return 'on-hold';
            }
        case 13:
            if(JSBI.GT(currentStep, JSBI.BigInt(11))){
                return 'is-done';
            }else if(emergencyActive){
                return 'canceled';
            } else if(JSBI.EQ(currentStep, JSBI.BigInt(11))) {
                return 'current';
            } else{
                return 'on-hold';
            }
        case 14:
            if(JSBI.GT(currentStep, JSBI.BigInt(11))){
                return 'is-done';
            }else if(emergencyActive){
                return 'canceled';
            } else if(tempLock && JSBI.EQ(currentStep, JSBI.BigInt(11))) {
                return 'current';
            } else{
                return 'on-hold';
            }
        case 15:
            if(JSBI.GE(currentStep, JSBI.BigInt(12)) && JSBI.EQ(totalSupply, BIG_INT_ZERO)){
                return 'is-done';
            }else if(emergencyActive){
                return 'canceled';
            } else if(JSBI.EQ(currentStep, JSBI.BigInt(12))) {
                return 'current';
            } else{
                return 'on-hold';
            }
        default:
            return 'canceled'
    }
    
}
export default function Roadmap() {
    const startMinting = useStartMinting()
    const lang = useUserLocale()
    /*
    currentStep == 0  1 USD Token x OFP for dev.
    currentStep == 1  request random words to chain link VRF.
    currentStep == 2  1 * 100.000 USD Token, 0 select token ids, 1 distribute.
    currentStep == 3  4 * 50.000 USD Token, 0 select token ids, 1 distribute.
    currentStep == 4  30 * 10.000 USD Token, 0 select token ids, 1 distribute.
    currentStep == 5  200 * 2.000 USD Token, 0 select token ids, 1 distribute.
    currentStep == 6  200 * 200 USD Token, 0 select token ids, 1 distribute.
    currentStep == 7  200 * 100 USD Token, 0 select token ids, 1 distribute.
    currentStep == 8  200 * 50 USD Token, 0 select token ids, 1 distribute.
    currentStep == 9  50 * 1.000 USD Token Twitter raffle.
    currentStep == 10 project funds, send project funds, 85% utility Tokens, set timelock minter, start second dev reward.
    currentStep == 11 40.000 USD Tokens for dev and start dev utility tokens reward.
    currentStep == 12  utility tokens for holders.
    */
    return (
            <div className='row'>
                <div className='col-12 d-flex my-2'>
                    <h3><Trans>Roadmap</Trans></h3>
                </div>
                <div className='col-12 d-flex my-2'>
                    <ThemedContainer maxWidth='100%'>
                        <div className='row px-4'>
                            <div className='col-12 d-flex my-3'>
                                <img src={PROJECT_TOKEN.iconUrl} width={30} alt="" />
                                <h4 className='mb-0 ms-2'><Trans>Onifinance Project</Trans></h4>
                            </div>
                            <div className='col-12 roadmap'>
                                <li className={ "roadmap-item " + RoadmapItemStatus(0)}>
                                    <strong><Trans>Start of minting</Trans></strong>
                                    <Trans>Minting begins on { startMinting?new Date(JSBI.toNumber(startMinting) * 1000).toLocaleDateString(lang??"en-EN", { year: 'numeric',month: 'long',day: 'numeric',hour: 'numeric',minute: 'numeric',timeZoneName: 'short' }) + " " + Intl.DateTimeFormat().resolvedOptions().timeZone:""}.</Trans>
                                </li>
                                <li className={ "roadmap-item " + RoadmapItemStatus(1)}>
                                    <strong><Trans>Developer reward</Trans></strong>
                                    <Trans>The developer will be able to claim 1 USDC token for every minted OFP token.</Trans>
                                </li>
                                <li className={ "roadmap-item " + RoadmapItemStatus(2)}>
                                    <strong><Trans>End of minting</Trans></strong>
                                    <Trans>Minting ends when token number 20000 is minted.</Trans>
                                </li>
                                <li className={ "roadmap-item " + RoadmapItemStatus(3)}>
                                    <strong><Trans>Random seeds</Trans></strong>
                                    <Trans>Seven random seeds are generated using <a className='text-reset' href='https://docs.chain.link/vrf/v2/introduction' target='_blank' rel="noopener noreferrer">Chainlink VRF</a>, one for each decentralized raffle.</Trans>
                                </li>
                                <li className={ "roadmap-item " + RoadmapItemStatus(4)}>
                                    <strong><Trans>Decentralized raffle</Trans></strong>
                                    <Trans>1 OFP token will be selected and the token owner will be able to claim 100000 USDC tokens.</Trans>
                                </li>
                                <li className={ "roadmap-item " + RoadmapItemStatus(5)}>
                                    <strong><Trans>Decentralized raffle</Trans></strong>
                                    <Trans>4 OFP tokens will be selected and holders of the selected tokens will be able to claim 50000 USDC tokens each.</Trans>
                                </li>
                                <li className={ "roadmap-item " + RoadmapItemStatus(6)}>
                                    <strong><Trans>Decentralized raffle</Trans></strong>
                                    <Trans>30 OFP tokens will be selected and holders of the selected tokens will be able to claim 10000 USDC tokens each.</Trans>
                                </li>
                                <li className={ "roadmap-item " + RoadmapItemStatus(7)}>
                                    <strong><Trans>Decentralized raffle</Trans></strong>
                                    <Trans>200 OFP tokens will be selected and holders of the selected tokens will be able to claim 2000 USDC tokens each.</Trans>
                                </li>
                                <li className={ "roadmap-item " + RoadmapItemStatus(8)}>
                                    <strong><Trans>Decentralized raffle</Trans></strong>
                                    <Trans>200 OFP tokens will be selected and holders of the selected tokens will be able to claim 200 USDC tokens each.</Trans>
                                </li>
                                <li className={ "roadmap-item " + RoadmapItemStatus(9)}>
                                    <strong><Trans>Decentralized raffle</Trans></strong>
                                    <Trans>200 OFP tokens will be selected and holders of the selected tokens will be able to claim 100 USDC tokens each.</Trans>
                                </li>
                                <li className={ "roadmap-item " + RoadmapItemStatus(10)}>
                                    <strong><Trans>Decentralized raffle</Trans></strong>
                                    <Trans>200 OFP tokens will be selected and holders of the selected tokens will be able to claim 50 USDC tokens each.</Trans>
                                </li>
                                <li className={ "roadmap-item " + RoadmapItemStatus(11)}>
                                    <strong><Trans>Community raffle</Trans></strong>
                                    <Trans>Fifty community members will be randomly selected on Twitter and will be able to claim 1000 USDC tokens each. To participate, users must follow the <a className='text-reset' href="https://twitter.com/onifinancedao" target='_blank' rel="noopener noreferrer">official Onifinance account</a> on Twitter and retweet a specified tweet for the raffle. The delivery of the tokens must be authorized by the community using the governance system.</Trans>
                                </li>
                                <li className={ "roadmap-item " + RoadmapItemStatus(12)}>
                                    <strong><Trans>Project funds and dev reward.</Trans></strong>
                                    <Trans>850 million OFI tokens will be transferred to the governance system (85% of the initial supply), 800000 USDC tokens, and the ability to mint new OFI tokens. Additionally, the developer will receive a total of 19000 USDC tokens over the course of 6 months.</Trans>
                                </li>
                                <li className={ "roadmap-item " + RoadmapItemStatus(13)}>
                                    <strong><Trans>Onifinance DAO construction begins</Trans></strong>
                                    <Trans>With the funds raised by the Onifinance Project, the construction of Onifinance DAO begins. All code for the Onifinance DAO smart contracts will be audited before launch.</Trans>
                                </li>
                                <li className={ "roadmap-item " + RoadmapItemStatus(14)}>
                                    <strong><Trans>Developer reward</Trans></strong>
                                    <Trans>After the launch of Onifinance DAO, the developer requests the bounty and must wait 60 days to claim 40,000 USDC tokens. The OFP contract will then start giving the developer a total of 50 million OFI tokens (5% of the initial supply) over the course of 5 years. The community can reject the request using the governance system.</Trans>
                                </li>
                                <li className={ "roadmap-item " + RoadmapItemStatus(15)}>
                                    <strong><Trans>Exchange</Trans></strong>
                                    <Trans>Each OFP token can be exchanged for 5000 OFI tokens after 60 days of the Onifinance DAO launch. 100 million OFI tokens (10% of the initial supply) will be distributed in total.</Trans>
                                </li>
                            </div>
                        </div>
                    </ThemedContainer>
                </div>
                <div className='col-12 d-flex my-2'>
                    <ThemedContainer maxWidth='100%'>
                        <div className='row px-4'>
                            <div className='col-12 d-flex my-3'>
                                <img src={UTILITY_TOKEN.iconUrl} width={30} alt="" />
                                <h4 className='mb-0 ms-2'><Trans>Onifinance DAO</Trans></h4>
                            </div>
                            <div className='col-12 roadmap'>
                                <li className={ "roadmap-item future"}>
                                    <strong><Trans>Community treasure</Trans></strong>
                                    <Trans>100 million OFI tokens will be made available to the community through the Onifanance DAO governance system (10% of the initial supply).</Trans>
                                </li>
                                <li className={ "roadmap-item future"}>
                                    <strong><Trans>Launch of Onifinance DAO</Trans></strong>
                                    <Trans>Once the source code of the smart contracts has been audited, the operation of the Onifinance DAO officially begins with an Automated Market Maker (AMM) and its own governance system.</Trans>
                                </li>
                                <li className={ "roadmap-item future"}>
                                    <strong><Trans>Liquidity Mining</Trans></strong>
                                    <Trans>Liquidity mining will begin shortly after the launch of the Onifinance DAO, 650 million OFI tokens (65% of the initial supply) will be distributed through this method.</Trans>
                                </li>
                                <li className={ "roadmap-item future"}>
                                    <strong><Trans>Developer reward</Trans></strong>
                                    <Trans>50 million OFI tokens (5% of the initial supply) will be distributed among the staff who contribute significantly to the creation of Onifinance DAO. The tokens will be delivered over the course of 5 years, with the OFP developer excluded from this reward.</Trans>
                                </li>
                                <li className={ "roadmap-item future"}>
                                    <strong><Trans>Airdrop</Trans></strong>
                                    <Trans>50 million OFI tokens will be distributed through the Airdrop (5% of the initial supply).</Trans>
                                </li>
                                <li className={ "roadmap-item future"}>
                                    <strong><Trans>Onifinance Dollar</Trans></strong>
                                    <Trans>Onifanance Dollar OFD will be a multi-collateralized and over-collateralized stablecoin that will allow the exchange of any token for OFD tokens using the liquidity pools of the Automated Market Maker (AMM), will use <a className='text-reset' target='_blank' rel="noopener noreferrer" href="https://data.chain.link/">Chainlink Data Feeds</a> to track the USD price and will be controlled by the Onifanance DAO governance system.</Trans>
                                </li>
                                <li className={ "roadmap-item future"}>
                                    <strong><Trans>Onifinance Name System</Trans></strong>
                                    <Trans>The Onifinance Name System will allow the registration of decentralized domain names .ofi, charging 1 OFD token for each domain per year. During the first 6 months, the registration of 1 .ofi domain name per address will be allowed for free, excluding contract addresses.</Trans>
                                </li>
                                <li className={ "roadmap-item future"}>
                                    <strong><Trans>Other Stablecoins</Trans></strong>
                                    <Trans>Other stablecoins will be created at the request of the community.</Trans>
                                </li>
                                <li className={ "roadmap-item future"}>
                                    <strong><Trans>Other Networks</Trans></strong>
                                    <Trans>Expansion to other networks at the request of the community.</Trans>
                                </li>
                            </div>
                            <div className='col-12 mt-4'>
                                <span className='me-1'><Trans>Items marked with this icon: <span className='future-icon' />, are subject to change by the community, using the governance system.</Trans></span>
                            </div>
                        </div>
                    </ThemedContainer>
                </div>
            </div>
    )
}