import { Trans } from "@lingui/macro"
import { ReactNode, useCallback, useState } from "react"
import {  CurrencyAmount, Token } from "../../sdk-core"
import ActionButton from "../ActionButton"
import ArrowWrapper from "../ArrowWrapper"
import { SimpleCurrencyInputPanel } from "../InputPanel"
import TransactionConfirmationModal, { ConfirmationModalContent, TransactionErrorContent } from "../TransactionConfirmationModal"


export default function ConfirmMintModal({
    onConfirm,
    onDismiss,
    mintErrorMessage,
    isOpen,
    attemptingTxn,
    txHash,
    inputAmount,
    outputAmount,
  }: {
    isOpen: boolean
    attemptingTxn: boolean
    txHash: string | undefined
    onConfirm: () => void
    mintErrorMessage: ReactNode | undefined
    onDismiss: () => void
    inputAmount?: CurrencyAmount<Token> | null
    outputAmount?: CurrencyAmount<Token> | null
  }) {
    const [shouldLogModalCloseEvent, setShouldLogModalCloseEvent] = useState(false)
    const onModalDismiss = useCallback(() => {
        if (isOpen) setShouldLogModalCloseEvent(true)
        onDismiss()
      }, [isOpen, onDismiss])
      
      const modalHeader = () => {
        return (
            <>
              <SimpleCurrencyInputPanel value={inputAmount?.toSignificant()|| "0"} logoUrl={inputAmount?.currency.iconUrl || "NA"} symbol={inputAmount?.currency.symbol || "NA"}/>
              <ArrowWrapper />
              <SimpleCurrencyInputPanel value={outputAmount?.toSignificant() || "0"} logoUrl={outputAmount?.currency.iconUrl || "NA"} symbol={outputAmount?.currency.symbol || "NA"}/>
            </>
        )
      }
    
      const modalBottom = useCallback(() => {
        return (
          <div className='row'>
            <div className='col-12 d-grid gap-2 mt-4'>
              <ActionButton onClick={onConfirm}>
                <Trans>Confirm minting</Trans>
              </ActionButton>
            </div>
            { mintErrorMessage ? 
              <div className='col-12'>
                <img src="alert-triangle" alt="" />
                <p>{mintErrorMessage}</p>
              </div>
              : null
            }
          </div>
        )
      }, [
        onConfirm,
        mintErrorMessage,
        txHash,
      ])
     // text to show while loading
  const pendingText = (
    <Trans>
      Minting {outputAmount?.toSignificant()} {outputAmount?.currency?.symbol} for{' '}
      {inputAmount?.toSignificant(6)} {inputAmount?.currency?.symbol}
    </Trans>
  )


  const confirmationContent = useCallback(
    () =>
      mintErrorMessage ? (
        <TransactionErrorContent onDismiss={onModalDismiss} message={mintErrorMessage} />
      ) : (
        <ConfirmationModalContent
          title={<Trans>Confirm minting</Trans>}
          onDismiss={onModalDismiss}
          topContent={modalHeader}
          bottomContent={modalBottom}
        />
      ),
    [onModalDismiss, inputAmount, outputAmount, modalBottom, modalHeader, mintErrorMessage]
  )
    return (
        <TransactionConfirmationModal
            isOpen={isOpen}
            onDismiss={onModalDismiss}
            attemptingTxn={attemptingTxn}
            hash={txHash}
            content={confirmationContent}
            pendingText={pendingText}
            currencyToAdd={outputAmount?.currency}
        />
    )
}