import { Trans } from '@lingui/macro'
import { Currency } from '../../sdk-core'
import { useWeb3React } from '@web3-react/core'
import { Dispatch, ReactNode, SetStateAction, useCallback, useState } from 'react'
import * as confettiLib from "canvas-confetti";

import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import Modal from '../Modal'
import { useUserTheme } from '../../state/user/hooks'
import CloseButton from '../CloseButton'
import ThemedContainer from '../ThemedContainer'
import { Loader } from '../Loader'

import { ArrowUpCircle, AlertTriangle } from 'react-feather'
import Check_Icon from '../../assets/svg/check-icon.svg'
import './index.css'
import ActionButton from '../ActionButton'

function ConfirmationPendingContent({
  onDismiss,
  pendingText,
  confetti,
}: {
  onDismiss: () => void
  pendingText: ReactNode
  confetti?: ConfettiProps

}) {
  const theme = useUserTheme()
  return (
    <ThemedContainer className='overflow-auto'>
      <div className='row'>
        <div className='col-12 d-flex justify-content-end'>
            <CloseButton onClick={onDismiss} />
        </div>
        <div className='col-12 text-center my-4'>
          <Loader width={70} height={70}/>
        </div>
        <div className='col-12 text-center my-4'>
          {  
            confetti && confetti.confetti?
              <h6>
                {pendingText}
              </h6>
            : 
              <h5>
                <Trans>Waiting for confirmation</Trans>
              </h5>
          } 
        </div>
        <div className='col-12 text-center'>
        {
          confetti && confetti.confetti?
            <h5>
              <Trans>Waiting for confirmation</Trans>
            </h5>
          :
            <h6>
              {pendingText}
            </h6>}
          
        </div>
        <div className='col-12 text-center'>
          <small className={'small-text ' + theme}>
            <Trans>Confirm this transaction in your wallet</Trans>
          </small>
        </div>
      </div>
    </ThemedContainer>
  )
}

const GoConfetti = () => {
  const rep = 20;
  let count = 0;
  const interval = setInterval(async () => {
    confettiLib.default({
      particleCount: 100,
      startVelocity: 30,
      spread: 360,
      zIndex:20000,
      origin: {
        x: Math.random(),
        // since they fall down, start a bit higher than random
        y: Math.random() - 0.2
      }
    });
    count ++;
    if(count >= rep){
      clearInterval(interval);
    }
    
  }, 1300);
}

function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
  currencyToAdd,
  confetti,
}: {
  onDismiss: () => void
  hash: string | undefined
  chainId: number
  currencyToAdd?: Currency | undefined
  confetti?: ConfettiProps | undefined
}) {
  
  if(confetti?.confettiActive){GoConfetti()}
  confetti?.setConfettiActive(false)
  

  const { connector } = useWeb3React()

  const token = currencyToAdd?.wrapped

  const [success, setSuccess] = useState<boolean | undefined>()

  const addToken = useCallback(() => {
    if (!token?.symbol || !token?.iconUrl || !connector.watchAsset) return
    connector
      .watchAsset({
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
        image: window.location.origin+token.iconUrl,
      })
      .then(() => setSuccess(true))
      .catch(() => setSuccess(false))
  }, [connector, token])

  return (
    <ThemedContainer className='overflow-auto'>
      <div className='row'>
        <div className='col-12 d-flex justify-content-end'>
          <CloseButton onClick={onDismiss} />
        </div>
        <div className='col-12 text-center my-4'>
          { confetti && confetti.confetti?
          <img src={confetti.iconUrl} alt="" width={80} height={80}/>
          :
          <ArrowUpCircle size={70} color="#0d6efd" strokeWidth={1}/>
          }
        </div>
        <div className='col-12 text-center my-4'>
          <h5>{confetti && confetti.confetti?confetti.successMessage:<Trans>Transaction submitted</Trans>}</h5>
        </div>
        <div className='col-12 text-center mb-4'>
          {currencyToAdd && connector.watchAsset && (
            <button disabled={success??false} className='btn btn-outline-primary' onClick={addToken}>
              {!success ? (
                <div>
                  <Trans>Add {currencyToAdd.symbol}</Trans>
                </div>
              ) : (
                <div className='d-flex'>
                  <Trans>Added {currencyToAdd.symbol} </Trans>
                  <img className='ms-2' src={Check_Icon} width={24} alt=''/>
                </div>
              )}
            </button>
          )}
        </div>
        {confetti && confetti?'':
          <div className='col-12 text-center d-grid gap-2 my-2'>
            <ActionButton onClick={onDismiss}>
              <Trans>Close</Trans>
            </ActionButton>
          </div>
        }
        {chainId && hash && (
            <div className='col-12 text-center'>
              <a className='text-decoration-none' target="_blank" href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)} rel='noopener noreferrer'>
              <small>
                <Trans>View on Explorer</Trans>
              </small>
            </a>
            </div>
          )}
      </div>
    </ThemedContainer>
  )
}

export function ConfirmationModalContent({
  title,
  onDismiss,
  topContent,
  bottomContent,
  maxWidth,
}: {
  title: ReactNode
  onDismiss: () => void
  topContent: () => ReactNode
  bottomContent?: () => ReactNode | undefined
  maxWidth?: string | undefined
}) {
  return (
    <ThemedContainer maxWidth={maxWidth} maxHeight='82vh' className='overflow-auto'>
      <div className='row'>
        <div className='col-9 mb-2'>
          <span>{title}</span>
        </div>
        <div className='col-3 mb-2 d-flex justify-content-end'>
          <CloseButton onClick={onDismiss} />
        </div>
        <div className='col-12 '>
            {topContent()}
        </div>
        {bottomContent && <div className='col-12'>{bottomContent()}</div>}
      </div>
    </ThemedContainer>
  )
}

export function TransactionErrorContent({ message, onDismiss }: { message: ReactNode; onDismiss: () => void }) {
  
  return (
    <ThemedContainer maxHeight='85vh' className='overflow-auto'>
      <div className='row'>
        <div className='col-9 mb-2'>
          <span><Trans>Error</Trans></span>
        </div>
        <div className='col-3 mb-2 d-flex justify-content-end'>
          <CloseButton onClick={onDismiss} />
        </div>
        <div className='col-12 text-center my-4'>
          <AlertTriangle size={70} color="#ffc107" strokeWidth={1}/>
        </div>
        <div className='col-12 text-center my-4'>
          <span className='text-break'>{message}</span>
        </div>
        <div className='col-12 text-center d-grid gap-2 my-2'>
          <ActionButton onClick={onDismiss}>
            <Trans>Dismiss</Trans>
          </ActionButton>
        </div>
      </div>
    </ThemedContainer>
  )
}
interface ConfettiProps{
  confetti: boolean
  iconUrl: string
  successMessage: string
  confettiActive: boolean
  setConfettiActive: Dispatch<SetStateAction<boolean>>
}
interface ConfirmationModalProps {
  isOpen: boolean
  onDismiss: () => void
  hash: string | undefined
  content: () => ReactNode
  attemptingTxn: boolean
  pendingText: ReactNode
  currencyToAdd?: Currency | undefined
  confetti?: ConfettiProps | undefined
  maxWidth?: string | undefined
}

export default function TransactionConfirmationModal({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content,
  currencyToAdd,
  confetti,
  maxWidth
}: ConfirmationModalProps) {
  const { chainId } = useWeb3React()

  if (!chainId) return null

  // confirmation screen
  return (
    <Modal isOpen={isOpen} scrollOverlay={true} onDismiss={onDismiss} maxHeight={90} maxWidth={maxWidth}>
      {attemptingTxn ? (
        <ConfirmationPendingContent onDismiss={onDismiss} pendingText={pendingText} confetti={confetti}/>
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
          currencyToAdd={currencyToAdd}
          confetti={confetti}
        />
      ) : (
        content()
      )}
    </Modal>
  )
}
