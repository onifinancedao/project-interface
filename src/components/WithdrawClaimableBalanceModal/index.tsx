import { t, Trans } from "@lingui/macro"
import { useWeb3React } from "@web3-react/core"
import { ReactNode, useCallback, useState } from "react"
import { BIG_INT_ZERO } from "../../constants/misc"
import { USD_TOKEN } from "../../constants/tokens"
import { CurrencyAmount, Token } from "../../sdk-core"
import { useCloseModal, useModalIsOpen } from "../../state/application/hooks"
import { ApplicationModal } from "../../state/application/reducer"
import { useClaimableBalance, useUserLocale, useWithdrawClaimableBalanceCallback } from "../../state/user/hooks"
import ActionButton from "../ActionButton"
import TransactionConfirmationModal, { ConfirmationModalContent, TransactionErrorContent } from "../TransactionConfirmationModal"

export default function WithdrawClaimableBalanceModal() {
  const { account } = useWeb3React()
  const isOpen = useModalIsOpen(ApplicationModal.WITHDRAW_CLAIMABLE_BALANCE)
  const onDismiss = useCloseModal(ApplicationModal.WITHDRAW_CLAIMABLE_BALANCE)
  const claimableBalance = useClaimableBalance()
  const [confettiActive, setConfettiActive] = useState(true)
  const [{ showConfirm, amount, transactionErrorMessage, attemptingTxn, txHash }, setTransactionState] = useState<{
    showConfirm: boolean
    amount: CurrencyAmount<Token> | null | undefined
    attemptingTxn: boolean
    transactionErrorMessage: string | undefined | ReactNode
    txHash: string | undefined
  }>({
    showConfirm: false,
    amount: undefined,
    attemptingTxn: false,
    transactionErrorMessage: undefined,
    txHash: undefined,
  })

  const transactionCallback = useWithdrawClaimableBalanceCallback()
  const locale = useUserLocale()

  async function handleTransaction() {
    // if callback not returned properly ignore
    if(!transactionCallback)return

    setTransactionState({ 
      attemptingTxn: true, 
      amount,
      showConfirm, 
      transactionErrorMessage: undefined, 
      txHash: undefined 
    })

    // try tx and store hash
    const hash = await transactionCallback(account, claimableBalance?.toString())?.catch((error) => {
      setTransactionState({
        attemptingTxn: false,
        amount: undefined,
        showConfirm,
        transactionErrorMessage: error.message,
        txHash: undefined,
      })
    })

    if (hash) {
      setTransactionState({ 
        attemptingTxn: false, 
        amount, 
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
        amount: undefined,
        showConfirm: false, 
        transactionErrorMessage: undefined, 
        txHash: undefined 
      })
    }, [isOpen, onDismiss])
    
    const modalHeader = () => {
      
      return (
        <div className='col-12 my-4'>
          <div className="row">
            <div className="col-12 my-4 d-flex justify-content-center">
              <img src={USD_TOKEN.iconUrl} alt="" width={80} height={80}/>
            </div>
            <div className="col-12 mt-4 d-flex justify-content-center">
              <span style={{fontSize: "40px"}}>{Number(CurrencyAmount.fromRawAmount(USD_TOKEN, claimableBalance || BIG_INT_ZERO).toExact()).toLocaleString(locale??"en-US")} {USD_TOKEN.symbol}</span>
            </div>
            <div className="col-12 mt-2 mb-4 d-flex justify-content-center text-center">
              <span><Trans>Your dedication and effort have been valuable to the project's success, and we want to acknowledge your contribution 🎁.</Trans></span>
            </div>
          </div>
        </div>
      )
    }
  
    const modalBottom = useCallback(() => {
      return (
        <div className='row'>
          <div className='col-12 d-grid gap-2 mt-4'>
            <ActionButton onClick={handleTransaction}><Trans>Withdraw</Trans></ActionButton>
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
const pendingText = (
  <div className="row">
    <div className="col-12 mt-4 mb-2 text-center">
      <h5><Trans>Withdrawing</Trans></h5>
    </div>
    <div className="col-12 mb-4 text-center">
      <h2>{CurrencyAmount.fromRawAmount(USD_TOKEN, claimableBalance || BIG_INT_ZERO).toExact()} {USD_TOKEN.symbol}</h2>
    </div>
    
  </div>
)


const confirmationContent = useCallback(
  () =>
    transactionErrorMessage ? (
      <TransactionErrorContent onDismiss={onModalDismiss} message={transactionErrorMessage} />
    ) : (
      <ConfirmationModalContent
        title={<Trans>Withdraw</Trans>}
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
          confetti={{confetti:true,iconUrl:USD_TOKEN.iconUrl??'', successMessage:"🎉"+t`Withdrew!`+"🥳",confettiActive:confettiActive, setConfettiActive:setConfettiActive}}
      />
  )
}