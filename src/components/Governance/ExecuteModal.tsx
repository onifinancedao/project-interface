import { t, Trans } from "@lingui/macro"
import { BigNumber } from "@ethersproject/bignumber"
import { ChangeEvent, ReactNode, useCallback, useState } from "react"

import { useCloseModal, useModalIsOpen } from "../../state/application/hooks"
import { ApplicationModal } from "../../state/application/reducer"
import { useExecuteCallback } from "../../state/governance/hooks"
import { useUserTheme } from "../../state/user/hooks"

import ActionButton from "../ActionButton";

import TransactionConfirmationModal, { ConfirmationModalContent, TransactionErrorContent } from "../TransactionConfirmationModal"
import { isNumber } from "../../utils"
import { isBigNumberish } from "@ethersproject/bignumber/lib/bignumber"

export default function ExecuteModal({proposalId}:{proposalId: string | undefined}) {
    const isOpen = useModalIsOpen(ApplicationModal.EXECUTE)
    const onDismiss = useCloseModal(ApplicationModal.EXECUTE)
  
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

    const [usingGasLimit, setUsingGasLimit] = useState(false)
    const [gasLimit, setGasLimit] = useState<BigNumber|undefined>(undefined)
    function handleGasLimit(val: string) {
      
      if(isBigNumberish(val)){
        setGasLimit(BigNumber.from(val))
      }else{
        setGasLimit(undefined)
      }
    }
    const handleInput = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value
        const withoutSpaces = input.replace(/\s+/g, '')
        handleGasLimit(withoutSpaces)
      },
      [handleGasLimit]
    )
    const theme = useUserTheme()
    const transactionCallback = useExecuteCallback()
  
    async function handleTransaction() {
      // if callback not returned properly ignore
      if(!transactionCallback)return
      setTransactionState({ 
        attemptingTxn: true,
        showConfirm, 
        transactionErrorMessage: undefined, 
        txHash: undefined 
      })
  
      // try tx and store hash
      const hash = await transactionCallback(proposalId, gasLimit)?.catch((error) => {
        
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
        onDismiss()
        setTransactionState({ 
          attemptingTxn: false,
          showConfirm: false, 
          transactionErrorMessage: undefined, 
          txHash: undefined 
        })
      }, [isOpen, onDismiss])
      
      const modalHeader = () => {
        return (
          <div className='col-12'>
            <div className="row">
              <div className="col-12">
                <div className="form-check form-switch">
                  <input onChange={()=>{setUsingGasLimit(!usingGasLimit)}} checked={usingGasLimit} className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"/>
                  <label className="form-check-label" htmlFor="flexSwitchCheckDefault"><Trans>Use gas limit</Trans></label>
                </div>
              </div>
              <div className="col-12 my-2 text-center">
                <Trans>Execute proposal {proposalId}</Trans>
              </div>
              <div className="col-12">
                { usingGasLimit && 
                  <div className="mt-2">
                    <label htmlFor="6asLimitInput" className="form-label"><Trans>Gas Limit</Trans></label>
                    <input type="text" onChange={handleInput} className={"form-control " + theme} id="gasLimitInput" placeholder={t`Gas Limit`}/>
                    <div className="mt-2"><Trans>Set gas limit: {gasLimit?.toNumber()}</Trans></div>
                  </div>
                }
              </div>
            </div>
          </div>
        )
      }
    
      const modalBottom = useCallback(() => {
        return (
          <div className='row'>
            <div className='col-12 d-grid gap-2 mt-4'>
                <ActionButton onClick={handleTransaction}>
                    <Trans>Execute Proposal</Trans>
                </ActionButton>
            </div>
            { transactionErrorMessage ? 
              <div className='col-12'>
                <img src="alert-triangle" alt="" />
                <p>{transactionErrorMessage}</p>
              </div>
              : null
            }
          </div>
        )
      }, [
        handleTransaction,
        transactionErrorMessage,
        txHash,
      ])
     // text to show while loading
  const pendingText = <Trans>Executing proposal {proposalId}</Trans>
  
  
  const confirmationContent = useCallback(
    () =>
      transactionErrorMessage ? (
        <TransactionErrorContent onDismiss={onModalDismiss} message={transactionErrorMessage} />
      ) : (
        <ConfirmationModalContent
          title={<Trans>Execute proposal</Trans>}
          onDismiss={onModalDismiss}
          topContent={modalHeader}
          bottomContent={modalBottom}
        />
      ),
    [onModalDismiss , modalBottom, modalHeader, transactionErrorMessage]
  )
    return (
        <TransactionConfirmationModal
            isOpen={isOpen}
            onDismiss={onModalDismiss}
            attemptingTxn={attemptingTxn}
            hash={txHash}
            content={confirmationContent}
            pendingText={pendingText}
        />
    )
}