import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import JSBI from 'jsbi'
import { useState } from 'react'
import { CurrencyAmount } from '../../sdk-core'

import { BIG_INT_ZERO } from '../../constants/misc'
import { PROJECT_TOKEN, UTILITY_TOKEN } from '../../constants/tokens'
import { useEmergencyActive } from '../../state/emergency/hooks'
import { useTokensOfOwner, useTokenURI, useUserTheme } from '../../state/user/hooks'

import { useToggleModal } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/reducer'
import { useCurrentStep, useUtilityTokenAmount } from '../../state/roadMap/hooks'
import ConfirmExchangeModal from '../../components/ConfirmExchangeModal'

import Exchange_Icon from "../../assets/svg/claim-icon.svg"

import './card.css'
import ImgFromUri from '../../components/ImgFromUri'

function Token({token, amount, selected, onClick}:{token: JSBI, amount: JSBI, selected: boolean, onClick: () => void}){
    const theme = useUserTheme()
    const tokenURI = useTokenURI(token.toString())
    return(
        <div className='col-12 col-sm-6 col-md-4 col-lg-3 mb-4'>
            <div className={(selected?"selected":"")+" card selectable-card " + theme} onClick={()=>{onClick()}}>
                {tokenURI && 
                    <ImgFromUri 
                        uri={tokenURI}
                        className='card-img-top'
                    />
                }
                <div className="card-body">
                    <h5 className="card-title text-center">{PROJECT_TOKEN.symbol} #{token.toString()}</h5>
                </div>
                <div className="card-footer d-flex justify-content-center">
                    <small className='normal-text text-success'>+ {CurrencyAmount.fromRawAmount(UTILITY_TOKEN, amount.toString()).toSignificant()} {UTILITY_TOKEN.symbol}</small>
                    <span className='hidden-text'>{!selected?<Trans>Add to exchange</Trans>:<Trans>Remove from exchange</Trans>}</span>
                </div>
            </div>
        </div>
    )
}

export default function Exchange() {
    const {account} = useWeb3React()
    const theme = useUserTheme()
    const step = useCurrentStep()
    const emergency = useEmergencyActive()
    const tokensOfOwnerWithData = useTokensOfOwner(account)
    const amount = useUtilityTokenAmount()
    const [tokensToExchange, setTokensToExchange] = useState<Array<JSBI>>([]);
    
    const includes = (token:JSBI) =>{
        return tokensToExchange.filter((tk) => JSBI.EQ(tk,token)).length > 0? true: false
    }

    const toggleModal = useToggleModal(ApplicationModal.EXCHANGE)
    const toggleExchange = (token:JSBI) =>{
        if(includes(token)){
            const ntokens = tokensToExchange.filter((tk) => !JSBI.EQ(tk,token));
            setTokensToExchange(ntokens)
        }else{
            const ntokens = [...tokensToExchange];
            ntokens.push(token)
            setTokensToExchange(ntokens)
        }
    }
    const cancelAll = () =>{
        setTokensToExchange([]);
    }

    const selectAll = () =>{
        var ntokens = [...tokensToExchange];
        tokensOfOwnerWithData?.map((token) =>{
            if (!includes(token)) {
                ntokens.push(token);
            }
        });
        setTokensToExchange(ntokens);
    }
    return (
        <>
        <ConfirmExchangeModal list={tokensToExchange} setList={setTokensToExchange} amount={amount??BIG_INT_ZERO}/>
        <div className='row'>
            <div className='col-12 d-flex justify-content-between align-items-center'>
                <span className='fs-4'><Trans>Exchange</Trans></span>
                {account && !emergency && step && JSBI.EQ(step, JSBI.BigInt(12)) && tokensOfOwnerWithData && tokensOfOwnerWithData.length > 0 && <span>{tokensOfOwnerWithData.length} Tokens</span>}
            </div>
            {account && !emergency && step && JSBI.EQ(step, JSBI.BigInt(12)) && tokensOfOwnerWithData && tokensOfOwnerWithData.length > 0 &&
                <div style={{height: '60px'}} className={'col-12 d-flex justify-content-between align-items-center sticky-top bg-'+theme}>
                    {tokensToExchange.length > 0?
                        <button className="mb-2 btn btn-primary btn-sm" onClick={()=>{cancelAll()}}>
                            <Trans>Cancel all</Trans>
                        </button>
                    :
                        <button className="mb-2 btn btn-primary btn-sm" onClick={()=>{selectAll()}}>
                            <Trans>Select all</Trans>
                        </button>
                    }
                    <button onClick={toggleModal} type="button" disabled={tokensToExchange.length === 0} className="btn btn-primary btn-sm position-relative me-2">
                        <img style={{filter: 'invert(1)', width: '30px'}} alt="" src={Exchange_Icon} />
                        {tokensToExchange.length > 0 &&
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {tokensToExchange.length}
                            </span>
                        }
                    </button>
                </div>
            }
            <div className='col-12 mt-4'>
                <div className='row'>
                    {account && !emergency && step && JSBI.EQ(step, JSBI.BigInt(12)) && tokensOfOwnerWithData && tokensOfOwnerWithData.length > 0 && tokensOfOwnerWithData.map((token, index)=>{
                        return(<Token token={token} amount={amount??BIG_INT_ZERO} selected={includes(token) ? true : false} onClick={()=>{toggleExchange(token)}} key={index}/>)
                    })}
                    {account && emergency && tokensOfOwnerWithData && tokensOfOwnerWithData.length > 0 && 
                        <div className='col-12 text-center'>
                            <Trans>Emergency active.</Trans>
                        </div>
                    }
                    {account && !emergency && step && JSBI.LT(step, JSBI.BigInt(12)) && tokensOfOwnerWithData && tokensOfOwnerWithData.length > 0 && 
                        <div className='col-12 text-center'>
                            <Trans>It's not time yet.</Trans>
                        </div>
                    }
                    {account && !emergency && step && JSBI.EQ(step, JSBI.BigInt(12)) && tokensOfOwnerWithData && tokensOfOwnerWithData.length === 0 &&
                        <div className='col-12 text-center'>
                            <Trans>No tokens to display</Trans>
                        </div>
                    }
                    {!account &&
                        <div className='col-12 text-center'>
                            <Trans>To continue you must connect a wallet</Trans>
                        </div>
                    }
                </div>
            </div>
        </div>
        </>
    )
}