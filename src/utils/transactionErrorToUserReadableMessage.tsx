import { t } from '@lingui/macro'
import { ReactNode } from 'react'

export function transactionErrorToUserReadableMessage(error: any) {
  // if the user rejected the tx, pass this along 
  console.error(t`Transaction failed`, error)
  if (error?.code === 4001 || error?.code === 'ACTION_REJECTED' || error?.code === -32603 || error?.code === -32000) {
    
    return(
      t`Transaction rejected`
    )
  } else {
    // otherwise, the error was unexpected and we need to convey that
    return transactionErrorReadableMessage(error)
  }
}
/**
 * This is hacking out the revert reason from the ethers provider thrown error however it can.
 * This object seems to be undocumented by ethers.
 * @param error an error from the ethers provider
 */

function transactionErrorReadableMessage(error: any): string {
  let reason: string | undefined
  while (Boolean(error)) {
    reason = error.reason ?? error.message ?? reason
    error = error.error ?? error.data?.originalError
  }

  if (reason?.indexOf('execution reverted: ') === 0) reason = reason.substr('execution reverted: '.length)

  switch (reason) {
    case 'Execive Amount':
      return (
        t`The amount of tokens to be minted is greater than the minting limit.`
      )
    case 'Not enough tokens':
      return (
        t`The amount of tokens to be minted added to the amount of tokens in circulation exceeds the maximum total supply.`
      )
    case 'Insufficient user balance':
      return (
        t`The user's balance in {USD_TOKEN.symbol} tokens is not enough to mint the requested amount`
      )
    case'The emergency has been activated':
      return (
        t`The emergency state is activated, most functions are permanently disabled`
      )
    default:
      if (reason?.indexOf('undefined is not an object') !== -1) {
        console.error(error, reason)
        return (
          t`An error occurred when trying to execute this tranasaction.`
        )
      }
      return (
        t`Unknown error${reason ? `: "${reason}"` : ''}`
      )
  }
}
