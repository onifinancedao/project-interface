import { Trans } from '@lingui/macro'
import { FormEvent, ReactNode, useCallback, useRef, useState } from 'react';
import { AdvancedCurrencyInputPanel } from '../../components/InputPanel';
import { PROJECT_TOKEN, USD_TOKEN, UTILITY_TOKEN } from '../../constants/tokens';

import { useUserLocale } from '../../state/user/hooks'

import Help_Circle_Icon from '../../assets/svg/help-circle-icon.svg'
import './index.css'
import { useWeb3React } from '@web3-react/core';
import { useTokenBalances } from '../../lib/hooks/useCurrencyBalance';
import { useEmergencyActive } from '../../state/emergency/hooks';
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink';
import { useMaxTotalSupply, useMintCallback, useMintLimit, useStartMinting, useTokenAllowance, useTokenPrice, useTotalSupply } from '../../state/mint/hooks';
import JSBI from 'jsbi';
import { isNumber } from '../../utils';
import { formatCurrencyAmount } from '../../utils/formatCurrencyAmounts';
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback';
import { CurrencyAmount, MaxUint256, Token } from '../../sdk-core';
import { MintCountdown } from '../../components/MintCountdown';
import ThemedContainer from '../../components/ThemedContainer';
import ArrowWrapper from '../../components/ArrowWrapper';
import ActionButton from '../../components/ActionButton';
import ConfirmMintModal from '../../components/ConfirmMintModal';
import { CORE_ADDRESS } from '../../constants/addresses';
import { useCurrentStep } from '../../state/roadMap/hooks';
import { BIG_INT_ZERO } from '../../constants/misc';

export default function Mint() {
  
  const locale = useUserLocale()
  const { account, chainId } = useWeb3React()
  const tokensBalance = useTokenBalances(account ?? USD_TOKEN.address, [USD_TOKEN,PROJECT_TOKEN,UTILITY_TOKEN])
  
  const currentStep = useCurrentStep()
  const emergencyActive = useEmergencyActive()
  const tokenPrice = useTokenPrice()
  const now = JSBI.BigInt((new Date().getTime()/1000).toFixed(0))
  const sartMinting = useStartMinting()
  const mintLimit = useMintLimit()
  const maxTotalSupply = useMaxTotalSupply()
  const totalSupply = useTotalSupply()
  const usdAllowance = useTokenAllowance()
  const [approvalState, approveCallback] = useApproveCallback(CurrencyAmount.fromRawAmount(USD_TOKEN, MaxUint256), CORE_ADDRESS)
  const [approvalPending, setApprovalPending] = useState<boolean>(false)
  
  

  const handleApprove = useCallback(async () => {
    setApprovalPending(true)
    try {
      
      await approveCallback()
      
    } finally {
      setApprovalPending(false)
    }
  }, [ approveCallback ])
    
    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault()
    };

    const projectTokenInput = useRef<HTMLInputElement>(null)
    const usdInput = useRef<HTMLInputElement>(null)
    const [amount, setAmount] = useState(JSBI.BigInt(0));
    const [totalWei, setTotalWei] = useState(JSBI.BigInt(0));

    const max = ()=>{
      if(projectTokenInput.current){
        let max = "";
        if(account && tokensBalance[USD_TOKEN.address] && mintLimit && tokenPrice && totalSupply && maxTotalSupply){
          const maxTokensToPay = JSBI.divide(tokensBalance[USD_TOKEN.address]?.quotient??BIG_INT_ZERO, tokenPrice)
          const remainingAmount = JSBI.subtract(maxTotalSupply, totalSupply)

          max = Math.min(JSBI.toNumber(mintLimit), JSBI.toNumber(maxTokensToPay), JSBI.toNumber(remainingAmount)).toString();
        }
        projectTokenInput.current.value = max;
        getTotal()
      }
    }

    const getTotal = () =>{
        let totalWei = JSBI.BigInt(0)

        if(usdInput.current && mintLimit && tokenPrice){
    
          if(projectTokenInput.current?.value){
    
            var amount = JSBI.BigInt(0);
            if(isNumber(projectTokenInput.current.value)){
              amount = JSBI.BigInt(Math.trunc(Number(projectTokenInput.current.value)));
    
            }
    
            if(JSBI.lessThan(amount, JSBI.BigInt(0))){
    
              amount = JSBI.BigInt(0);
    
            }else if(JSBI.greaterThan(amount, mintLimit)){
    
              amount = mintLimit;
              
            }
            projectTokenInput.current.value = amount.toString();
            setAmount(amount);
            totalWei = JSBI.multiply(amount, tokenPrice);
            if(JSBI.greaterThan(totalWei, JSBI.BigInt(0))){
              usdInput.current.value = formatCurrencyAmount(totalWei , USD_TOKEN.decimals, 6);
            }else{
              usdInput.current.value = "";
            }
          }else{
            usdInput.current.value = "";
          }
        }
        setTotalWei(totalWei);
    }
    
  //Mint
  const mintCallback = useMintCallback()

  // modal and loading
  const [{ showConfirm, inputAmount, outputAmount, mintErrorMessage, attemptingTxn, txHash }, setMintState] = useState<{
    showConfirm: boolean
    inputAmount: CurrencyAmount<Token> | null | undefined
    outputAmount: CurrencyAmount<Token> | null | undefined
    attemptingTxn: boolean
    mintErrorMessage: string | undefined | ReactNode
    txHash: string | undefined
  }>({
    showConfirm: false,
    inputAmount: undefined,
    outputAmount: undefined,
    attemptingTxn: false,
    mintErrorMessage: undefined,
    txHash: undefined,
  })

  async function handleMint() {
    // if callback not returned properly ignore
    if(!mintCallback)return

    setMintState({ 
      attemptingTxn: true, 
      inputAmount,
      outputAmount,
      showConfirm, 
      mintErrorMessage: undefined, 
      txHash: undefined 
    })

    // try mint and store hash
    const hash = await mintCallback(account, amount.toString())?.catch((error) => {
      setMintState({
        attemptingTxn: false,
        inputAmount: undefined,
        outputAmount: undefined,
        showConfirm,
        mintErrorMessage: error.message,
        txHash: undefined,
      })
    })

    if (hash) {
      setMintState({ 
        attemptingTxn: false, 
        inputAmount,
        outputAmount, 
        showConfirm, 
        mintErrorMessage: undefined, 
        txHash: hash 
      })
    }
  }

  const handleConfirmDismiss = useCallback(() => {
    setMintState({ showConfirm: false, inputAmount, outputAmount ,attemptingTxn, mintErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash && projectTokenInput.current) {
      projectTokenInput.current.value = "";
      getTotal()
    }
  }, [attemptingTxn, mintErrorMessage, txHash])
    //End Mint
    return (
        <div className='col-12'>
          <ConfirmMintModal
              isOpen={showConfirm}
              attemptingTxn={attemptingTxn}
              txHash={txHash}
              onConfirm={handleMint}
              mintErrorMessage={mintErrorMessage}
              onDismiss={handleConfirmDismiss}
              inputAmount={inputAmount}
              outputAmount={outputAmount}
            />
            <div className='row justify-content-center'>
                <div className='col-12 col-md-7 col-lg-5'>
                    <ThemedContainer>
                        <form onSubmit={handleSubmit}>
                            <div className="my-2 mx-2">
                                <h4><Trans>Mint</Trans></h4>
                                <AdvancedCurrencyInputPanel 
                                    inputReference={usdInput}
                                    url = { getExplorerLink(chainId??1, USD_TOKEN.address, ExplorerDataType.TOKEN) } 
                                    logoUrl = { USD_TOKEN.iconUrl??Help_Circle_Icon }
                                    symbol = {USD_TOKEN.symbol??''}
                                    smallText = { account && tokensBalance[USD_TOKEN.address]? <span><Trans>balance: {Number(tokensBalance[USD_TOKEN.address]?.toExact()).toLocaleString(locale??"en-US")}</Trans></span>:undefined }
                                    disabled = {true}
                                    placeHolder = "0.0"
                                />
                                <ArrowWrapper />
                                <AdvancedCurrencyInputPanel 
                                    inputReference={projectTokenInput}
                                    url = { getExplorerLink(chainId??1, PROJECT_TOKEN.address, ExplorerDataType.TOKEN) }  
                                    logoUrl = { PROJECT_TOKEN.iconUrl??Help_Circle_Icon }
                                    symbol = {PROJECT_TOKEN.symbol??''}
                                    smallText = { account && tokensBalance[PROJECT_TOKEN.address]? <span><Trans>balance: {Number(tokensBalance[PROJECT_TOKEN.address]?.toSignificant()).toLocaleString(locale??"en-US")}</Trans></span>:undefined }
                                    smallBtn={ account && tokensBalance[USD_TOKEN.address] && tokenPrice && totalSupply && maxTotalSupply && JSBI.GE(tokensBalance[USD_TOKEN.address]?.quotient, tokenPrice) && JSBI.LT(totalSupply, maxTotalSupply)? <small onClick={()=>{max()}} className="text-muted text-decoration-underline" style={{cursor:"pointer"}}>max</small>:undefined}
                                    disabled = {emergencyActive}
                                    onInput={()=>{getTotal()}}
                                />
                                <div className='my-1 mx-2'>
                                    {tokenPrice && <span style={{fontSize: "15px"}}><Trans>Price: 1 { PROJECT_TOKEN.symbol } = {formatCurrencyAmount(tokenPrice , USD_TOKEN.decimals, 6) } {USD_TOKEN.symbol}</Trans></span>}
                                </div>
                                <div className='my-1 mx-2'>
                                    {maxTotalSupply && totalSupply && !JSBI.GE(sartMinting, now) && <span style={{fontSize: "15px"}}><Trans>Minted tokens: { totalSupply.toLocaleString() } { PROJECT_TOKEN.symbol } / { maxTotalSupply.toLocaleString() } { PROJECT_TOKEN.symbol }.</Trans></span>}
                                </div>
                                { JSBI.GE(sartMinting, now) && <MintCountdown />}
                                <div className="d-grid gap-2 mt-2">
                                    {
                                      account && usdAllowance && sartMinting && JSBI.GT(totalWei, JSBI.BigInt(0)) && JSBI.LT(usdAllowance, totalWei) && JSBI.GE(now, sartMinting) &&
                                      <ActionButton
                                        onClick={handleApprove} 
                                        disabled={approvalPending || approvalState === ApprovalState.PENDING || approvalState === ApprovalState.APPROVED}
                                      >
                                        <Trans>Approve the use of your {USD_TOKEN.symbol} tokens</Trans>
                                      </ActionButton>
                                    }
                                    <ActionButton
                                      disabled={
                                        !(
                                          account && usdAllowance && totalSupply && maxTotalSupply && currentStep &&
                                          JSBI.LT(totalSupply, maxTotalSupply) && 
                                          JSBI.EQ(currentStep, BIG_INT_ZERO) &&
                                          JSBI.LE(amount, JSBI.subtract(maxTotalSupply, totalSupply)) && 
                                          JSBI.GE(usdAllowance, totalWei) && 
                                          JSBI.GT(totalWei, JSBI.BigInt(JSBI.BigInt(0))) &&  
                                          !JSBI.GE(sartMinting, now)
                                        )
                                      }
                                      onClick={() => {
                                        setMintState({
                                          inputAmount: CurrencyAmount.fromRawAmount(USD_TOKEN, totalWei),
                                          outputAmount: CurrencyAmount.fromRawAmount(PROJECT_TOKEN, amount),
                                          attemptingTxn: false,
                                          mintErrorMessage: undefined,
                                          showConfirm: true,
                                          txHash: undefined,
                                        })
                                      }}
                                    >
                                      { JSBI.GE(now, sartMinting)?<Trans>Mint</Trans>:<Trans>Coming soon</Trans>}
                                    </ActionButton>
                                </div>
                            </div>
                        </form>
                        </ThemedContainer>
                  </div>
            </div>
        </div>
    )
}