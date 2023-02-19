import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import JSBI from 'jsbi'
import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import IdentIcon from '../../components/IdentIcon'
import { Loader } from '../../components/Loader'
import { BIG_INT_ZERO } from '../../constants/misc'
import { PROJECT_TOKEN, USD_TOKEN } from '../../constants/tokens'
import { CurrencyAmount } from '../../sdk-core'
import { useRaffleAmounts, useRaffleResult, RAFFLE_WINNERS } from '../../state/raffle/hooks'
import { useCurrentStep } from '../../state/roadMap/hooks'
import { useUserTheme } from '../../state/user/hooks'
import { isNumber, shortenAddress } from '../../utils'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import './index.css'
function Winner({raffle, index, amount}:{raffle:number, index:number, amount: JSBI}){
    const {account, chainId} = useWeb3React()
    const raffleResult = useRaffleResult(raffle, index)
    const theme = useUserTheme()
    if(raffleResult){
        return(
            <div className='col-12 col-sm-6 col-md-4 col-lg-3 mb-4'>
                <div className={'card winner-card ' + theme + (account && raffleResult.owner === account?" hit":"")}>
                    <div className="card-header">
                        <div className='row'>
                            <div className='col-12 text-center'>
                                <span style={{position: "absolute",left: "10px"}}>{index+1}</span>
                                {   raffle === 7?
                                        raffleResult.name !== ""?
                                            <a  className='text-decoration-none'
                                                href={"https://twitter.com/"+raffleResult.name} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                            >
                                                {raffleResult.name}
                                            </a>
                                        :
                                            <Trans>Invalid account</Trans>
                                    
                                    :
                                    <a  className='text-decoration-none'
                                        href={"https://opensea.io/assets/matic/"+PROJECT_TOKEN.address+"/"+raffleResult.IDToken.toString()} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        {PROJECT_TOKEN.symbol} #{raffleResult.IDToken.toString()}
                                    </a>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='card-body'>
                        <a className='d-flex justify-content-center text-decoration-none'
                           href={getExplorerLink(chainId??1, raffleResult.owner, ExplorerDataType.ADDRESS)}
                           target="_blank"
                           rel="noopener noreferrer"
                        >
                            <IdentIcon address={raffleResult.owner} />
                            <span className='ms-1'>{shortenAddress(raffleResult.owner)}</span>
                        </a>
                        {raffleResult.evidence !== '' &&
                        
                        <div className='mt-2'>
                            <a className='d-flex justify-content-center'
                           href={raffleResult.evidence}
                           target="_blank"
                           rel="noopener noreferrer"
                        >
                            <Trans>Evidence</Trans>
                        </a>
                            </div>
                        }
                    </div>
                    <div className='card-footer text-center'>
                        <small className='text-success'>+ {CurrencyAmount.fromRawAmount(USD_TOKEN, amount.toString()).toSignificant()} {USD_TOKEN.symbol}</small>
                    </div>
                </div>
            </div>
        )
    }else{
        return(
            <div className='col-12 col-sm-6 col-md-4 col-lg-3 mb-4'>
                <div className={'card winner-card ' + theme}>
                    <div className='ms-3 mt-2'>{index+1}</div>
                    <div className='d-flex m-4 pb-4 p-t-2 justify-content-center'>
                        <Loader />
                    </div>
                </div>
            </div>
            )
    }
}

function RaffleResults({showRaffle, amount, currentStep}:{showRaffle:number, amount:JSBI, currentStep:JSBI}) {
    function raffleIsDone(){
        switch (showRaffle) {
            case 0:
                if(JSBI.GT(currentStep, JSBI.BigInt(2))){
                    return true
                }else{
                   return false 
                }
            case 1:
                if(JSBI.GT(currentStep, JSBI.BigInt(3))){
                    return true
                }else{
                   return false 
                }
            case 2:
                if(JSBI.GT(currentStep, JSBI.BigInt(4))){
                    return true
                }else{
                   return false 
                }
            case 3:
                if(JSBI.GT(currentStep, JSBI.BigInt(5))){
                    return true
                }else{
                   return false 
                }
            case 4:
                if(JSBI.GT(currentStep, JSBI.BigInt(6))){
                    return true
                }else{
                   return false 
                }
            case 5:
                if(JSBI.GT(currentStep, JSBI.BigInt(7))){
                    return true
                }else{
                   return false 
                }
            case 6:
                if(JSBI.GT(currentStep, JSBI.BigInt(8))){
                    return true
                }else{
                   return false 
                }
            case 7:
                if(JSBI.GT(currentStep, JSBI.BigInt(9))){
                    return true
                }else{
                   return false 
                }
            default:
                return false
        }
    }
    if(raffleIsDone()){
        const winners = []
        for (let i = 0; i < RAFFLE_WINNERS[showRaffle]; i++) {
            winners.push(<Winner key={i} raffle={showRaffle} amount={amount} index={i} />)
        }
        return(
            <div className='mt-4 col-12'>
                <div className='row'>
                    {winners}
                </div>
            </div>
        )
    }else{
        return(
            <div className='mt-4 col-12 text-center'>
                <Trans>The raffle has not yet been executed.</Trans>
            </div>
        )
    }
}
export default function Raffle() {
    
    const { id } = useParams() as { id: string }
    const raffleAmounts = useRaffleAmounts()
    const currentStep = useCurrentStep()
    const [showRaffle, setShowRaffle] = useState(isNumber(id)?Number(id)-1:0)
    const theme = useUserTheme()
    
    useEffect(()=> {
        if(isNumber(id)){
            setShowRaffle(Number(id) - 1)
        }else{
            setShowRaffle(0)
        }
    }, [id])

    return (
        <div className='row'>
            <div className='col-12 d-flex justify-content-between align-items-center'>
                <span className='fs-4'><Trans>Raffle</Trans></span>
            </div>
            <div className='col-12 mt-4'>
                <ul className={"nav nav-tabs raffles-tab d-flex justify-content-start " + theme}>
                    <li className="nav-item">
                        <a className={"nav-link " + (showRaffle === 0?"active":"")} aria-current="page" href='#/raffle/1'>1</a>
                    </li>
                    <li className="nav-item">
                        <a className={"nav-link " + (showRaffle === 1?"active":"")} aria-current="page" href='#/raffle/2'>2</a>
                    </li>
                    <li className="nav-item">
                        <a className={"nav-link " + (showRaffle === 2?"active":"")} aria-current="page" href='#/raffle/3'>3</a>
                    </li>
                    <li className="nav-item">
                        <a className={"nav-link " + (showRaffle === 3?"active":"")} aria-current="page" href='#/raffle/4'>4</a>
                    </li>
                    <li className="nav-item">
                        <a className={"nav-link " + (showRaffle === 4?"active":"")} aria-current="page" href='#/raffle/5'>5</a>
                    </li>
                    <li className="nav-item">
                        <a className={"nav-link " + (showRaffle === 5?"active":"")} aria-current="page" href='#/raffle/6'>6</a>
                    </li>
                    <li className="nav-item">
                        <a className={"nav-link " + (showRaffle === 6?"active":"")} aria-current="page" href='#/raffle/7'>7</a>
                    </li>
                    <li className="nav-item">
                        <a className={"nav-link " + (showRaffle === 7?"active":"")} aria-current="page" href='#/raffle/8'>8</a>
                    </li>
                </ul>
            </div>
            {RAFFLE_WINNERS[showRaffle] && <RaffleResults showRaffle={showRaffle} amount={raffleAmounts?raffleAmounts[showRaffle]:BIG_INT_ZERO} currentStep={currentStep??BIG_INT_ZERO}/>}
            {!RAFFLE_WINNERS[showRaffle] && <div className='col-12 mt-4 text-center'><Trans>Non-existent raffle</Trans></div>}
            
        </div>
        
    )
}