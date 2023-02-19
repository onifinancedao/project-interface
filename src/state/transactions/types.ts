export interface SerializableTransactionReceipt {
  to: string
  from: string
  contractAddress: string
  transactionIndex: number
  blockHash: string
  transactionHash: string
  blockNumber: number
  status?: number
}

/**
 * Be careful adding to this enum, always assign a unique value (typescript will not prevent duplicate values).
 * These values is persisted in state and if you change the value it will cause errors
 */
export enum TransactionType {
  APPROVAL = 0,
  MINT,
  ADD_CLAIM_DEV_REWARD,
  WITHDRAW,
  REQUEST_RANDOM_WORDS,
  SELECT_TOKENS,
  DISTRIBUTE,
  SEND_PROJECT_FUNDS,
  CLAIM_SECOND_REWARD,
  DELEGATE,
  SUBMIT_PROPOSAL,
  VOTE,
  QUEUE,
  EXECUTE,
  CANCEL,
  BURN,
  REQUEST_FINAL_REWARD,
  START_FINAL_REWARD,
  CLAIM_FINAL_REWARD,
  EXCHANGE,
}

export interface BaseTransactionInfo {
  type: TransactionType
}

export interface ApproveTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.APPROVAL
  tokenAddress: string
  spender: string
}

export interface MintTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.MINT
  recipient: string
  projectTokenAmountRaw?: string
}

export interface AddClaimDevRewardTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.ADD_CLAIM_DEV_REWARD
  usdAmount?: string
}

export interface WithdrawTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.WITHDRAW
  currencyAmountRaw?: string
  currencyAddress?: string
}

export interface RequestRandomWordsTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.REQUEST_RANDOM_WORDS
}

export interface SelectTokensTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.SELECT_TOKENS
}

export interface DistributeTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.DISTRIBUTE
}

export interface SendProjectFundsTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.SEND_PROJECT_FUNDS
}

export interface ClaimSecondRewardTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.CLAIM_SECOND_REWARD
}

export interface DelegateTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.DELEGATE
  delegatee: string
}

export interface SubmitProposalTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.SUBMIT_PROPOSAL
}

export interface VoteTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.VOTE
  proposalId: number
  support: boolean
  reason: string
}

export interface QueueTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.QUEUE
  proposalId: number
}

export interface ExecuteTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.EXECUTE
  proposalId: number
}

export interface CancelTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.CANCEL
  proposalId: number
}

export interface BurnTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.BURN
  projectTokenAmountRaw?: string
  currencyAmountRaw?: string
}

export interface RequestFinalRewardTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.REQUEST_FINAL_REWARD
}

export interface StartFinalRewardTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.START_FINAL_REWARD
}

export interface ClaimFinalRewardTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.CLAIM_FINAL_REWARD
}

export interface ExchangeTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.EXCHANGE
  projectTokenAmountRaw?: string
  currencyAmountRaw?: string
}

export type TransactionInfo =
  | ApproveTransactionInfo
  | MintTransactionInfo
  | AddClaimDevRewardTransactionInfo
  | WithdrawTransactionInfo
  | RequestRandomWordsTransactionInfo
  | SelectTokensTransactionInfo
  | DistributeTransactionInfo
  | SendProjectFundsTransactionInfo
  | ClaimSecondRewardTransactionInfo
  | DelegateTransactionInfo
  | SubmitProposalTransactionInfo
  | VoteTransactionInfo
  | QueueTransactionInfo
  | ExecuteTransactionInfo
  | CancelTransactionInfo
  | BurnTransactionInfo
  | RequestFinalRewardTransactionInfo
  | StartFinalRewardTransactionInfo
  | ClaimFinalRewardTransactionInfo
  | ExchangeTransactionInfo

export interface TransactionDetails {
  hash: string
  receipt?: SerializableTransactionReceipt
  lastCheckedBlockNumber?: number
  addedTime: number
  confirmedTime?: number
  from: string
  info: TransactionInfo
}
