import { Trans } from "@lingui/macro"
import { ReactNode, useCallback, useState } from "react"

import { useCloseModal, useModalIsOpen } from "../../state/application/hooks"
import { ApplicationModal } from "../../state/application/reducer"
import { useCancelCallback } from "../../state/governance/hooks"

import ActionButton from "../ActionButton";

import TransactionConfirmationModal, { ConfirmationModalContent, TransactionErrorContent } from "../TransactionConfirmationModal"

export default function CancelModal({proposalId}:{proposalId: string | undefined}) {
    const isOpen = useModalIsOpen(ApplicationModal.CANCEL)
    const onDismiss = useCloseModal(ApplicationModal.CANCEL)
  
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
  
    const transactionCallback = useCancelCallback()
  
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
      const hash = await transactionCallback(proposalId)?.catch((error) => {
        
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
          <div className='col-12 my-4 text-center'>
            <Trans>Cancel proposal {proposalId}</Trans>
          </div>
        )
      }
    
      const modalBottom = useCallback(() => {
        return (
          <div className='row'>
            <div className='col-12 d-grid gap-2 mt-4'>
                <ActionButton onClick={handleTransaction}>
                    <Trans>Cancel Proposal</Trans>
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
  const pendingText = <Trans>Canceling proposal {proposalId}</Trans>
  
  
  const confirmationContent = useCallback(
    () =>
      transactionErrorMessage ? (
        <TransactionErrorContent onDismiss={onModalDismiss} message={transactionErrorMessage} />
      ) : (
        <ConfirmationModalContent
          title={<Trans>Cancel proposal</Trans>}
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