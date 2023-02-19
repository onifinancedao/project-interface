import { t, Trans } from "@lingui/macro"
import { useWeb3React } from "@web3-react/core"
import { ChangeEvent, ReactNode, useCallback, useState } from "react"
import { isAddress } from "@ethersproject/address"

import { BIG_INT_ZERO, ZERO_ADDRESS } from "../../constants/misc"
import { PROJECT_TOKEN } from "../../constants/tokens"
import { useTokenBalance } from "../../lib/hooks/useCurrencyBalance"
import { useCloseModal, useModalIsOpen } from "../../state/application/hooks"
import { ApplicationModal } from "../../state/application/reducer"
import { useDelegateCallback, useUserDelegatee } from "../../state/governance/hooks"
import ActionButton from "../ActionButton"
import TransactionConfirmationModal, { ConfirmationModalContent, TransactionErrorContent } from "../TransactionConfirmationModal"
import { useUserTheme } from "../../state/user/hooks"
import JSBI from "jsbi"

export default function DelegateModal() {
  const { account, chainId } = useWeb3React()
  const isOpen = useModalIsOpen(ApplicationModal.DELEGATE)
  const onDismiss = useCloseModal(ApplicationModal.DELEGATE)

  const theme = useUserTheme()
  
  // get the number of votes available to delegate
  const projectTokenBalance = useTokenBalance(account ?? undefined, chainId ? PROJECT_TOKEN : undefined)
  
  const userDelegatee: string | undefined = useUserDelegatee()
  
  // state for delegate input
  const [usingDelegate, setUsingDelegate] = useState(false)
  
  const [delegateButton, setDelegateButton] = useState(true)

  const [typed, setTyped] = useState('')
  function handleRecipientType(val: string) {
    setTyped(val)
    if(isAddress(val)){
      setDelegateButton(false)
    }else{
      setDelegateButton(true)
    }
  }

  // monitor for self delegation or input for third part delegate
  // default is self delegation
  const activeDelegate = usingDelegate ? typed : account


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

  const transactionCallback = useDelegateCallback()

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
    const hash = await transactionCallback(activeDelegate)?.catch((error) => {
      
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

  const handleInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.target.value
      const withoutSpaces = input.replace(/\s+/g, '')
      handleRecipientType(withoutSpaces)
    },
    [handleRecipientType]
  )

  const onModalDismiss = useCallback(() => {
      onDismiss()
      setUsingDelegate(false)
      setDelegateButton(true)
      setTransactionState({ 
        attemptingTxn: false,
        showConfirm: false, 
        transactionErrorMessage: undefined, 
        txHash: undefined 
      })
    }, [isOpen, onDismiss])
    
    const modalHeader = () => {
      return (
        <div className='col-12 mb-2'>
          <div className="form-check form-switch">
            <input onChange={()=>{setUsingDelegate(!usingDelegate)}} checked={usingDelegate} className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"/>
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault"><Trans>Delegate to a third party</Trans></label>
          </div>
          {!usingDelegate && userDelegatee && projectTokenBalance && 
            <div className="text-center mt-4">
              {userDelegatee === account && <Trans>self-delegated!</Trans>}
              {userDelegatee === ZERO_ADDRESS && JSBI.GT(projectTokenBalance.quotient, BIG_INT_ZERO) && <Trans>Unlock votes</Trans>}
              {(userDelegatee !== account && userDelegatee !== ZERO_ADDRESS || userDelegatee === ZERO_ADDRESS && JSBI.EQ(projectTokenBalance.quotient, BIG_INT_ZERO)) && <Trans>Self-delegate</Trans>}
            </div>}
          {usingDelegate && <div className="text-center mt-4"><Trans>Delegate {projectTokenBalance?.toExact()} Votes</Trans></div>}
          { usingDelegate && 
            <div className="mt-2">
              <label htmlFor="delegateeInput" className="form-label"><Trans>Delegatee</Trans></label>
              <input type="text" onChange={handleInput} className={"form-control " + theme} id="delegateeInput" placeholder={t`Delegatee Address`}/>
            </div>
          }
        </div>
      )
    }
  
    const modalBottom = useCallback(() => {
      return (
        <div className='row'>
          <div className='col-12 d-grid gap-2 mt-4'>
            <ActionButton onClick={handleTransaction} disabled={userDelegatee === account && !usingDelegate? true:usingDelegate?delegateButton:false}>{userDelegatee === ZERO_ADDRESS ? usingDelegate ? <Trans>Delegate Votes</Trans> : <Trans>Self-delegate</Trans>: <Trans>Update Delegation</Trans>}</ActionButton>
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
const pendingText = usingDelegate ? <Trans>Delegating {projectTokenBalance?.toExact()} votes to { activeDelegate }</Trans> : <Trans>Self-delegating {projectTokenBalance?.toExact()} Votes</Trans>


const confirmationContent = useCallback(
  () =>
    transactionErrorMessage ? (
      <TransactionErrorContent onDismiss={onModalDismiss} message={transactionErrorMessage} />
    ) : (
      <ConfirmationModalContent
        title={userDelegatee === ZERO_ADDRESS ? usingDelegate ? <Trans>Delegating Votes</Trans> : <Trans>Self-delegating</Trans>: <Trans>Update Delegation</Trans>}
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