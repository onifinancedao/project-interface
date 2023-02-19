import { Trans } from '@lingui/macro'
import JSBI from 'jsbi'
import ThemedContainer from '../../components/ThemedContainer'
import { useEmergencyActive } from '../../state/emergency/hooks'
import { useMaxTotalSupply } from '../../state/mint/hooks'
import { useCurrentStep } from '../../state/roadMap/hooks'
import { useUserTheme } from '../../state/user/hooks'
export default function Home() {
    const maxTotalSupply = useMaxTotalSupply()
    const theme = useUserTheme()
    const currentStep = useCurrentStep()
    const emergencyActive = useEmergencyActive()

    return (
        <div className='row'>
            <div className='col-12 d-flex justify-content-center my-2'>
                <ThemedContainer maxWidth='900px'>
                    <h3 className='text-center my-2'><Trans>Onifinance Project</Trans></h3>
                    <Trans>The Onifinance Project is an initiative aimed at creating and launching the Onifinance DAO. To achieve this, the project allows users to mint OFP tokens in exchange for USDC tokens, each of which entitles them to one vote in the project's governance system. A total of 20000 OFP tokens will be allowed to be minted, and once minted, seven decentralized raffles will take place, each with different USDC token prizes. There will also be a community raffle on Twitter with 50 prizes of 1000 USDC tokens each. Users will be able to claim OFI tokens in exchange for their OFP tokens 60 days after the launch of the Onifinance DAO, and in case of emergency, the project has a mechanism to distribute the OFP contract balance among holders in exchange for their OFP tokens.</Trans>
                    <div className='d-flex justify-content-center my-4'>
                    { !emergencyActive && currentStep && JSBI.GE(currentStep,JSBI.BigInt(0)) && JSBI.LT(currentStep, JSBI.BigInt(2)) &&
                        <a href="#/mint" className={'text-reset text-decoration-none action-button ' + theme} style={{maxWidth:"450px", cursor:"pointer"}}>
                            <Trans>Mint</Trans>
                        </a>
                    }
                    { !emergencyActive && currentStep && JSBI.GE(currentStep,JSBI.BigInt(2)) && JSBI.LT(currentStep, JSBI.BigInt(13)) &&
                      <a href="#/raffle" className={'text-reset text-decoration-none action-button ' + theme} style={{maxWidth:"450px", cursor:"pointer"}}>
                        <Trans>Raffle</Trans>
                      </a>
                    }
                    { !emergencyActive && currentStep && JSBI.GE(currentStep,JSBI.BigInt(13)) &&
                        <a href="#/exchange" className={'text-reset text-decoration-none action-button ' + theme} style={{maxWidth:"450px", cursor:"pointer"}}>
                            <Trans>Exchange</Trans>
                        </a>
                    }
                    { emergencyActive &&
                        <a href="#/burn" className={'text-reset text-decoration-none action-button ' + theme} style={{maxWidth:"450px", cursor:"pointer"}}>
                            <Trans>Burn</Trans>
                        </a>
                   }    
                    </div>
                    <div className='d-flex justify-content-center'>
                        <a href="#/faq" className='text-reset ' style={{maxWidth:"450px", cursor:"pointer"}}><Trans>FAQs</Trans></a>
                    </div>
                </ThemedContainer>
            </div>
            <div className='col-12 d-flex justify-content-center mt-2 mb-4'>
                <ThemedContainer maxWidth='900px'>
                    <h3 className='text-center my-2'><Trans>Onifinance DAO</Trans></h3>
                    <div className='row'>
                        <div className='col-12'>
                            <p><Trans>The Onifinance DAO will be a decentralized autonomous organization (DAO) governed by a decentralized governance system. It will consist of three main elements:</Trans></p>
                            <p><Trans>The OFI token, which will be used as the utility token of the Onifinance DAO.</Trans></p>
                            <p><Trans>An Automated Market Maker (AMM) that will feature liquidity mining for the first three months in some selected token pairs.</Trans></p>
                            <p><Trans>The Onifinance Dollar (OFD) will be a stablecoin pegged to the US dollar.</Trans></p>
                            <p><Trans>In addition, shortly after its launch, the Onifinance DAO will introduce the Onifinance Name System, which will be a naming system that will allow users to purchase .ofi domains in exchange for OFD tokens.</Trans></p>
                        </div>
                    </div>
                </ThemedContainer>
            </div>
        </div>
        
    )
}