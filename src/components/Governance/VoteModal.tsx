import { t, Trans } from "@lingui/macro";
import { ChangeEvent, ReactNode, useCallback, useState } from "react";

import { useCloseModal, useModalIsOpen } from "../../state/application/hooks";
import { ApplicationModal } from "../../state/application/reducer";
import { useVoteCallback } from "../../state/governance/hooks";
import { useUserTheme } from "../../state/user/hooks";

import ActionButton from "../ActionButton";

import TransactionConfirmationModal, { ConfirmationModalContent, TransactionErrorContent } from "../TransactionConfirmationModal";

export default function VoteModal({proposalId, voteOption}:{proposalId: string | undefined, voteOption: boolean}) {
    const isOpen = useModalIsOpen(ApplicationModal.VOTE)
    const onDismiss = useCloseModal(ApplicationModal.VOTE)
    
    const theme = useUserTheme()

    const [ usingReason, setUsingReason ] = useState(false)
    const [ reason, setReason ] = useState('')

    const handleInput = useCallback(
      (event: ChangeEvent<HTMLTextAreaElement>) => {
        const input = event.target.value
        setReason(input)
      },
      [setReason]
    )

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
  
    const transactionCallback = useVoteCallback()
  
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
      const hash = await transactionCallback(proposalId, voteOption, reason)?.catch((error) => {
        
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
        setUsingReason(false)
        setReason('')
        setTransactionState({ 
          attemptingTxn: false,
          showConfirm: false, 
          transactionErrorMessage: undefined, 
          txHash: undefined 
        })
      }, [isOpen, onDismiss])
      
      const modalHeader = () => {
        return (
          <div className='col-12 my-4'>
            <div className="row">
              <div className="col-12 mb-4">
                <div className="form-check form-switch">
                  <input onChange={()=>{setUsingReason(!usingReason)}} checked={usingReason} className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"/>
                  <label className="form-check-label" htmlFor="flexSwitchCheckDefault"><Trans>Add reason</Trans></label>
                </div>
              </div>
              <div className="col-12 text-center fs-5">
                { voteOption ? (
                  <Trans>Vote for proposal {proposalId}</Trans>
                ) : (
                  <Trans>Vote against proposal {proposalId}</Trans>
                ) }
              </div>
              {usingReason && 
              <div className="col-12 mt-4">
                <label htmlFor="reasonInput" className="form-label"><Trans>Reason</Trans></label>
                <textarea onChange={handleInput} className={"form-control " + theme} id="reasonInput" placeholder={t`Reason`} rows={4}/>
              </div>}
            </div>
          </div>
        )
      }
    
      const modalBottom = useCallback(() => {
        return (
          <div className='row'>
            <div className='col-12 d-grid gap-2 mt-4'>
                <ActionButton onClick={handleTransaction}>
                    <Trans>Cast Vote</Trans>
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
  const pendingText = voteOption ? <Trans>Votting for proposal {proposalId}</Trans> : <Trans>Votting against proposal {proposalId}</Trans>
  
  
  const confirmationContent = useCallback(
    () =>
      transactionErrorMessage ? (
        <TransactionErrorContent onDismiss={onModalDismiss} message={transactionErrorMessage} />
      ) : (
        <ConfirmationModalContent
          title={<Trans>Cast Vote</Trans>}
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