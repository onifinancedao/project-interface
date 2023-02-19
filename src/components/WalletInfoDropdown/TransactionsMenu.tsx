import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { useCallback, useMemo } from 'react'

import Chevron_Left from "../../assets/svg/chevron-left-icon.svg"
import { useAppDispatch } from '../../state/hooks'
import { useAllTransactions } from '../../state/transactions/hooks'
import { clearAllTransactions } from '../../state/transactions/reducer'
import { TransactionDetails } from '../../state/transactions/types'
import { useUserTheme } from '../../state/user/hooks'
import { TransactionSummary } from './TransactionSummary'

interface TransactionInformation {
  title: JSX.Element
  transactions: TransactionDetails[]
}

function TransactionList({ transactionInformation }: { transactionInformation: TransactionInformation }){
  const theme = useUserTheme()
  const { title, transactions } = transactionInformation
  return(
    <div className={'py-2 border-bottom ' + theme}>
      <h6>{title}</h6>
      {transactions.map((transactionDetails) => (
        <TransactionSummary key={transactionDetails.hash} transactionDetails={transactionDetails} />
      ))}
    </div>
  )
}

const TransactionsMenu = ({ onClose }: { onClose: () => void }) => {
  const theme = useUserTheme()
  const allTransactions = useAllTransactions()
  const { chainId } = useWeb3React()
  const dispatch = useAppDispatch()
  const transactionGroupsInformation = []

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }))
  }, [dispatch, chainId])

  const [confirmed, pending] = useMemo(() => {
    const confirmed: Array<TransactionDetails> = []
    const pending: Array<TransactionDetails> = []

    const sorted = Object.values(allTransactions).sort((a, b) => b.addedTime - a.addedTime)
    sorted.forEach((transaction) => (transaction.receipt ? confirmed.push(transaction) : pending.push(transaction)))

    return [confirmed, pending]
  }, [allTransactions])

  if (pending.length) transactionGroupsInformation.push({ title: <span><Trans>Pending</Trans></span>, transactions: pending })
  if (confirmed.length) transactionGroupsInformation.push({ title: <span><Trans>Confirmed</Trans></span>, transactions: confirmed })
  
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 my-2 d-flex justify-content-between align-items-center">
          <img 
            className={"settings-menu-icon " + theme} 
            onClick={onClose} 
            width={24}
            style={{cursor:"pointer"}}
            src={Chevron_Left} alt="" />
          <h6 className="mb-0" 
            style={
              transactionGroupsInformation.length === 0?
              {
                position: "absolute",
                left: "50%",
                top: "36px",
                transform: "translate(-50%, -50%)"
              }:{}
            }
          >
            <Trans>Transactions</Trans>
          </h6>
          {transactionGroupsInformation.length > 0 && <small onClick={clearAllTransactionsCallback} style={{cursor:"pointer"}}><Trans>Clear All</Trans></small>}
        </div>
        <div className={"col-12 my-2 pt-3 border-top " + theme}>
          {
            transactionGroupsInformation.length > 0 ? (
              <>
                {
                  transactionGroupsInformation.map((transactionInformation, index) => (
                    <TransactionList key={index} transactionInformation={transactionInformation} />
                  ))
                }
              </>
            ) : (
              <span className='text-center'><Trans>Your transactions will appear here.</Trans></span>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default TransactionsMenu
