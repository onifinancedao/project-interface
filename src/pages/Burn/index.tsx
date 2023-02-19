import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import JSBI from 'jsbi'
import { useState } from 'react'

import { BIG_INT_ZERO } from '../../constants/misc'
import { PROJECT_TOKEN, USD_TOKEN } from '../../constants/tokens'
import { CurrencyAmount } from '../../sdk-core'
import { useEmergencyActive, useEmergencyWithdrawalAmount } from '../../state/emergency/hooks'
import { useTokenURI, useTokensOfOwner, useUserTheme } from '../../state/user/hooks'
import ConfirmBurnModal from '../../components/ConfirmBurnModal'
import { useToggleModal } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/reducer'

import ImgFromUri from '../../components/ImgFromUri'

import Burn_Icon from "../../assets/svg/burn-icon.svg"

import './card.css'

function Token({token, amount, selected, onClick}:{token: JSBI, amount: JSBI, selected: boolean, onClick: () => void}){
    const theme = useUserTheme()
    const tokenURI = useTokenURI(token.toString())
    return(
        <div className='col-12 col-sm-6 col-md-4 col-lg-3 mb-4'>
            <div className={(selected?"selected":"")+" card selectable-card " + theme} onClick={()=>{onClick()}}>
                { tokenURI && 
                    <ImgFromUri 
                        uri={tokenURI}
                        className='card-img-top'
                    />
                }
                <div className="card-body">
                    <h5 className="card-title text-center">{PROJECT_TOKEN.symbol} #{token.toString()}</h5>
                </div>
                <div className="card-footer d-flex justify-content-center">
                    <small className='normal-text text-success'>+ {CurrencyAmount.fromRawAmount(USD_TOKEN, amount.toString()).toSignificant()} {USD_TOKEN.symbol}</small>
                    <span className='hidden-text'>{!selected?<Trans>Add to burn</Trans>:<Trans>Remove from burn</Trans>}</span>
                </div>
            </div>
        </div>
    )
}

export default function Burn() {
    const {account} = useWeb3React()
    const theme = useUserTheme()
    const emergency = useEmergencyActive()
    const tokensOfOwner = useTokensOfOwner(account)
    const amount = useEmergencyWithdrawalAmount()
    const [tokensToBurn, setTokensToBurn] = useState<Array<JSBI>>([]);
    
    const includes = (token:JSBI) =>{
        return tokensToBurn.filter((tk) => JSBI.EQ(tk,token)).length > 0? true: false
    }

    const toggleModal = useToggleModal(ApplicationModal.BURN)
    const toggleBurn = (token:JSBI) =>{
        if(includes(token)){
            const ntokens = tokensToBurn.filter((tk) => !JSBI.EQ(tk,token));
            setTokensToBurn(ntokens)
        }else{
            const ntokens = [...tokensToBurn];
            ntokens.push(token)
            setTokensToBurn(ntokens)
        }
    }
    const cancelAll = () =>{
        setTokensToBurn([]);
    }

    const selectAll = () =>{
        var ntokens = [...tokensToBurn];
        tokensOfOwner?.map((token) =>{
            if (!includes(token)) {
                ntokens.push(token);
            }
        });
        setTokensToBurn(ntokens);
    }
    return (
        <>
        <ConfirmBurnModal list={tokensToBurn} setList={setTokensToBurn} amount={amount??BIG_INT_ZERO}/>
        <div className='row'>
            <div className='col-12 d-flex justify-content-between align-items-center'>
                <span className='fs-4'><Trans>Burn</Trans></span>
                {account && emergency && tokensOfOwner && tokensOfOwner.length > 0 && <span>{tokensOfOwner.length} Tokens</span>}
            </div>
            {account && emergency && tokensOfOwner && tokensOfOwner.length > 0 &&
                <div style={{height: '60px'}} className={'col-12 d-flex justify-content-between align-items-center sticky-top bg-'+theme}>
                    {tokensToBurn.length > 0?
                        <button className="mb-2 btn btn-primary btn-sm" onClick={()=>{cancelAll()}}>
                            <Trans>Cancel all</Trans>
                        </button>
                    :
                        <button className="mb-2 btn btn-primary btn-sm" onClick={()=>{selectAll()}}>
                            <Trans>Select all</Trans>
                        </button>
                    }
                    <button onClick={toggleModal} type="button" disabled={tokensToBurn.length === 0} className="btn btn-primary btn-sm position-relative me-2">
                        <img style={{filter: 'invert(1)', width: '30px'}} alt="" src={Burn_Icon} />
                        {tokensToBurn.length > 0 &&
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {tokensToBurn.length}
                            </span>
                        }
                    </button>
                </div>
            }
            <div className='col-12 mt-4'>
                <div className='row'>
                    {account && emergency && tokensOfOwner && tokensOfOwner.length > 0 && tokensOfOwner.map((token, index)=>{
                        return(<Token token={token} amount={amount??BIG_INT_ZERO} selected={includes(token) ? true : false} onClick={()=>{toggleBurn(token)}} key={index}/>)
                    })}
                    {account && !emergency && tokensOfOwner && tokensOfOwner.length > 0 && 
                        <div className='col-12 text-center'>
                            <Trans>Only available in an emergency</Trans>
                        </div>
                    }
                    {account && tokensOfOwner && tokensOfOwner.length === 0 &&
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