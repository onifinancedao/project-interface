import { createSlice } from '@reduxjs/toolkit'

import { TransactionDetails } from './types'

const now = () => new Date().getTime()

export interface TransactionState {
  [chainId: number]: {
    [txHash: string]: TransactionDetails
  }
}

export const initialState: TransactionState = {}

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction(transactions, { payload: { chainId, from, hash, info } }) {
      if (transactions[chainId]?.[hash]) {
        throw Error('Attempted to add existing transaction.')
      }
      const txs = transactions[chainId] ?? {}
      txs[hash] = { hash, info, from, addedTime: now() }
      transactions[chainId] = txs
    },
    clearAllTransactions(transactions, { payload: { chainId } }) {
      if (!transactions[chainId]) return
      transactions[chainId] = {}
    },
    checkedTransaction(transactions, { payload: { chainId, hash, blockNumber } }) {
      const tx = transactions[chainId]?.[hash]
      if (!tx) {
        return
      }
      if (!tx.lastCheckedBlockNumber) {
        tx.lastCheckedBlockNumber = blockNumber
      } else {
        tx.lastCheckedBlockNumber = Math.max(blockNumber, tx.lastCheckedBlockNumber)
      }
    },
    finalizeTransaction(transactions, { payload: { hash, chainId, receipt } }) {
      const tx = transactions[chainId]?.[hash]
      if (!tx) {
        return
      }
      tx.receipt = receipt
      tx.confirmedTime = now()
    },
  },
})

export const { addTransaction, clearAllTransactions, checkedTransaction, finalizeTransaction } =
  transactionSlice.actions
export default transactionSlice.reducer
