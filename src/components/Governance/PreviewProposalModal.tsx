import { Trans } from "@lingui/macro"
import { useWeb3React } from "@web3-react/core"
import { ReactNode, useCallback, useState } from "react"

import { useCloseModal, useModalIsOpen } from "../../state/application/hooks"
import { ApplicationModal } from "../../state/application/reducer"
import { CreateProposalData, ProposalDetail, useCreateProposalCallback } from "../../state/governance/hooks"
import ActionButton from "../ActionButton"
import TransactionConfirmationModal, { ConfirmationModalContent, TransactionErrorContent } from "../TransactionConfirmationModal"
import { extractProposalDetail, linkIfAddress } from "../../pages/Governance"
import Markdown from "../Markdown"
import DecodedDataBox from "./DecodedDataBox"

export default function PreviewProposalModal({proposalData}:{proposalData:CreateProposalData | undefined}) {
  const { account, chainId } = useWeb3React()
  const isOpen = useModalIsOpen(ApplicationModal.PROPOSAL_PREVIEW)
  const onDismiss = useCloseModal(ApplicationModal.PROPOSAL_PREVIEW)
  
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

  const transactionCallback = useCreateProposalCallback()

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
    const hash = await transactionCallback(proposalData)?.catch((error) => {
      
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

  let title = proposalData?.description.split(/#+\s|\n/g)[1]
  
  let details:ProposalDetail[] = proposalData?extractProposalDetail(proposalData.targets, proposalData.signatures, proposalData.calldatas, proposalData.values):[]
  
    const modalHeader = () => {
      return (
        <div className='col-12 mb-2'>
          <div className="row">
            {proposalData &&
              <div className="col-12 my-2">
                <div className="row">
                  <div className="col-12 my-2">
                    <span className="fs-4 fw-semibold">{title??<Trans>Untitled</Trans>}</span>
                  </div>
                  <div className="col-12 my-2">
                    <p className="fs-5 fw-semibold"><Trans>Details</Trans></p>
                    <DecodedDataBox details={details??[]}/>
                  </div>
                  <div className="col-12 my-2 text-break">
                    <p className="fs-5 fw-semibold"><Trans>Description</Trans></p>
                    <Markdown children={proposalData?.description}/>
                  </div>
                  <div className="col-12 my-2 text-break">
                    <p className="fs-5 fw-semibold"><Trans>Proposer</Trans></p>
                      {linkIfAddress(account || '', chainId)}
                  </div>
                </div>
              </div>
              }
          </div>
        </div>
      )
    }
  
    const modalBottom = useCallback(() => {
      return (
        <div className='row'>
          <div className='col-12 d-grid gap-2 mt-4'>
            <ActionButton onClick={handleTransaction}><Trans>Propose</Trans></ActionButton>
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
const pendingText = <Trans>Proposing</Trans>


const confirmationContent = useCallback(
  () =>
    transactionErrorMessage ? (
      <TransactionErrorContent onDismiss={onModalDismiss} message={transactionErrorMessage} />
    ) : (
      <ConfirmationModalContent
        title={<Trans>Propose</Trans>}
        onDismiss={onModalDismiss}
        topContent={modalHeader}
        bottomContent={modalBottom}
        maxWidth={'100%'}
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
          maxWidth={"670px"}
      />
  )
}