import { Trans } from "@lingui/macro"
import JSBI from "jsbi"
import { Dispatch, ReactNode, SetStateAction, useCallback, useState } from "react"
import { Trash } from "react-feather"
import { CurrencyAmount } from "../../sdk-core"

import { PROJECT_TOKEN, USD_TOKEN } from "../../constants/tokens"
import { useIsMobile } from "../../hooks/useIsMobile"
import { useCloseModal, useModalIsOpen } from "../../state/application/hooks"
import { ApplicationModal } from "../../state/application/reducer"
import { useDarkModeManager, useTokenURI, useUserTheme } from "../../state/user/hooks"
import CloseButton from "../CloseButton"
import Modal from "../Modal"
import { useEmergencyWithdrawCallback } from "../../state/emergency/hooks"
import TransactionConfirmationModal, { TransactionErrorContent } from "../TransactionConfirmationModal"

import ActionButton from "../ActionButton"

import './index.css'
import ImgFromUri from "../ImgFromUri"

function Token({token, amount, onClick}:{token: JSBI, amount: JSBI, onClick: () => void}){
  const [darkMode] = useDarkModeManager()
  const theme = useUserTheme()
  const tokenURI = useTokenURI(token.toString())
  return(
    <div className={"col-12 my-2 py-2 token-item " + theme}>
      <div className="row">
        <div className="col-3 ps-2 d-flex align-items-center col-md-4 col-lg-3">
          { tokenURI && 
          <ImgFromUri
          uri={tokenURI}
          height={70} 
          style={{borderRadius:"12px"}}
        />
          }
        </div>
         <div className="col-6 d-grid align-content-center text-center">
            <h6 className="text-center">{PROJECT_TOKEN.symbol} #{token.toString()}</h6>
            <small className='text-success'>+ {CurrencyAmount.fromRawAmount(USD_TOKEN, amount.toString()).toSignificant()} {USD_TOKEN.symbol}</small>
         </div>
         <div className="col-2 d-flex align-items-center">
          <Trash onClick={onClick} className="trash" color={darkMode?"#d2cfcf":"black"} size={24} />
         </div>
      </div>
    </div>
  )
}
export default function ConfirmBurnModal({list, setList, amount}:{list:JSBI[], setList: Dispatch<SetStateAction<JSBI[]>>, amount:JSBI}){
    const [darkMode, ] = useDarkModeManager()
    const isMobile = useIsMobile()
  
    const isOpen = useModalIsOpen(ApplicationModal.BURN)
    const closeModal = useCloseModal(ApplicationModal.BURN)

    const includes = (token:JSBI) =>{
      return list.filter((tk) => JSBI.EQ(tk,token)).length > 0? true: false
    }

    const toggleToken = (token:JSBI) =>{
      if(includes(token)){
          const ntokens = list.filter((tk) => !JSBI.EQ(tk,token));
          setList(ntokens)
      }else{
          const ntokens = [...list];
          ntokens.push(token)
          setList(ntokens)
      }
    }

    const [{ showConfirm, transactionErrorMessage, attemptingTxn, txHash }, setTransactionState] = useState<{
      showConfirm: boolean
      attemptingTxn: boolean
      transactionErrorMessage: string | undefined | ReactNode
      txHash: string | undefined
    }>({
      showConfirm: false,
      attemptingTxn: false,
      transactionErrorMessage: undefined,
      txHash: undefined,
    })
  
    const transactionCallback = useEmergencyWithdrawCallback()
  
    async function handleTransaction() {
      if(!transactionCallback)return
      setTransactionState({ 
        attemptingTxn: true,
        showConfirm, 
        transactionErrorMessage: undefined, 
        txHash: undefined 
      })
  
      // try tx and store hash
      const hash = await transactionCallback(list, amount)?.catch((error) => {
        
        setTransactionState({
          attemptingTxn: false,
          showConfirm,
          transactionErrorMessage: error.message,
          txHash: undefined,
        })
      })
  
      if (hash) {
        setTransactionState({ 
          attemptingTxn: false,
          showConfirm, 
          transactionErrorMessage: undefined, 
          txHash: hash 
        })
      }
    }

    const onModalDismiss = useCallback(() => {
      closeModal()
      setList([])
      setTransactionState({ 
        attemptingTxn: false,
        showConfirm: false, 
        transactionErrorMessage: undefined, 
        txHash: undefined 
      })
    }, [isOpen, closeModal])
  
  // text to show while loading
  const errorContent = useCallback(
    () =>
      transactionErrorMessage ? (
        <TransactionErrorContent onDismiss={onModalDismiss} message={transactionErrorMessage} />
      ) : (
        <div></div>
      ),
    [onModalDismiss , transactionErrorMessage]
  )
const pendingText = <Trans>Burning {list.length} {PROJECT_TOKEN.symbol} tokens in exchange for {CurrencyAmount.fromRawAmount(USD_TOKEN, JSBI.multiply(amount, JSBI.BigInt(list.length)).toString()).toSignificant()} {USD_TOKEN.symbol} tokens</Trans>
  if(attemptingTxn || txHash || transactionErrorMessage){
    return(
      <TransactionConfirmationModal
          isOpen={isOpen}
          onDismiss={onModalDismiss}
          attemptingTxn={attemptingTxn}
          hash={txHash}
          content={errorContent}
          pendingText={pendingText}
      />
    )
  }else{
    return (
      <Modal isOpen={isOpen} onDismiss={onModalDismiss} maxHeight={90}>
        {
          isOpen && (
            <div 
              className="px-2"
              style={
                {
                  position: (isMobile?"initial":"fixed"), 
                  top: "65px",
                  right: (isMobile?"auto":"20px"),
                  width: (isMobile?"100vw":"330px"),
                  zIndex: 1030
                }
              }
            >
                <div
                style={
                  {
                    borderRadius: "12px",
                    width: (isMobile?"100%":"320px"),
                    display: "flex",
                    flexDirection: "column",
                    fontSize: "16px",
                    top: "60px",
                    right: (isMobile?"0px":"70px"),
                    left:  (isMobile?"0px":"auto"),
                    backgroundColor: (darkMode?"rgb(18 18 18)":"rgb(255, 255, 255)"),
                    border: "1px solid",
                    borderColor: (darkMode?"rgb(42 42 42)":"rgb(210, 217, 238)"),
                    boxShadow: "rgb(51 53 72 / 4%) 8px 12px 20px, rgb(51 53 72 / 2%) 4px 6px 12px, rgb(51 53 72 / 4%) 4px 4px 8px",
                    padding: "16px 10px"
                  }
                }
                >
                <div className="container">
                    <div className="row">
                        <div className="col-12 my-2 py-2 d-flex align-items-center justify-content-between" 
                          style={{borderBottom:(darkMode?"1px solid rgba(255, 255, 255, 0.1)":"1px solid rgba(0, 0, 0, 0.1)")}}
                        >
                          <h5><Trans>To burn</Trans></h5>
                          <CloseButton onClick={closeModal}/>
                        </div>
                        { list.length > 0 &&
                        <div className="col-12 ">
                          <div className="row">
                            <div className="col-12 my-2 d-flex align-items-center justify-content-between">
                              {list.length} {PROJECT_TOKEN.symbol}
                              <span style={{cursor:"pointer"}} onClick={()=>{setList([])}}>
                                <Trans>Clear all</Trans>
                              </span>
                            </div>
                            <div className="col-12 "style={{overflow:"auto", maxHeight: "calc(85vh - 150px)"}}>
                              <div className="row">
                              {
                                list.map((token, index)=>{
                                  return(<Token token={token} amount={amount} onClick={()=>{toggleToken(token)}} key={index}/>)
                                })
                              }
                              <div className="col-12 my-2 py-2 d-flex justify-content-between align-items-center"
                                style={{borderTop:(darkMode?"1px solid rgba(255, 255, 255, 0.1)":"1px solid rgba(0, 0, 0, 0.1)")}}
                              >
                                <Trans>Total received</Trans>
                                <span>{CurrencyAmount.fromRawAmount(USD_TOKEN, JSBI.multiply(amount, JSBI.BigInt(list.length)).toString()).toSignificant()} {USD_TOKEN.symbol}</span>
                              </div>
                              <div className="col-12">
                                <ActionButton onClick={handleTransaction}><Trans>Burn {list.length} {PROJECT_TOKEN.symbol}</Trans></ActionButton>
                              </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        } 
                        {list.length === 0 &&
                        <div className="col-12 my-4 text-center">
                          <Trans>Add items to burn.</Trans>
                        </div>
                        }
                    </div>
                </div>
                </div>
            </div>
          )
        }
      </Modal>
    )
  }
}