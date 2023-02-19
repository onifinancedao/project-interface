import { useWeb3React } from '@web3-react/core'
import { t, Trans } from '@lingui/macro'

import { useTransaction } from '../../state/transactions/hooks'
import { 
  ApproveTransactionInfo, 
  MintTransactionInfo,
  AddClaimDevRewardTransactionInfo,
  TransactionInfo, 
  TransactionType, 
  WithdrawTransactionInfo,
  RequestRandomWordsTransactionInfo,
  DelegateTransactionInfo,
  SubmitProposalTransactionInfo,
  VoteTransactionInfo,
  QueueTransactionInfo,
  ExecuteTransactionInfo,
  CancelTransactionInfo
} from '../../state/transactions/types'

import { useToken } from '../../hooks/Tokens'

import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import tryParseCurrencyAmount from '../../utils/tryParseCurrencyAmount'

import { PROJECT_TOKEN, USD_TOKEN } from '../../constants/tokens'

import Check_Icon from "../../assets/svg/check-icon.svg"
import Alert_Triangle_Icon from "../../assets/svg/alert-triangle-icon.svg"
import CloseButton from '../CloseButton'
import { CurrencyAmount } from '../../sdk-core'

function ApprovalSummary({ info }: { info: ApproveTransactionInfo }) {
  
  const token = useToken(info.tokenAddress)

  return <Trans>Approve {token?.symbol}</Trans>
}

function MintSummary({ info }: { info: MintTransactionInfo}) {
  
  return (
    <Trans>Mint {tryParseCurrencyAmount(info.projectTokenAmountRaw, PROJECT_TOKEN)?.toSignificant()} {PROJECT_TOKEN.symbol}</Trans>
  )
}

function AddClaimDevRewardSummary({ info }: { info: AddClaimDevRewardTransactionInfo}) {
  
  return (
    <Trans>Add { info.usdAmount} {USD_TOKEN.symbol}</Trans>
  )
}

function WithdrawSummary({ info }: { info: WithdrawTransactionInfo}) {
  const token = useToken(info.currencyAddress)
  return (
    <Trans>Withdraw { token && info.currencyAmountRaw && CurrencyAmount.fromRawAmount(token, info.currencyAmountRaw).toExact()} { token?.symbol }</Trans>
  )
}

function RequestRandomWordsSummary({ info }: { info: RequestRandomWordsTransactionInfo}) {
  
  return (
    <Trans>Request random words</Trans>
  )
}

function DelegateSummary({ info }: { info: DelegateTransactionInfo}) {
  
  return (
    <Trans>Update delegate</Trans>
  )
}

function SubmitProposalSummary({ info }: { info: SubmitProposalTransactionInfo}) {
  
  return (
    <Trans>Submit proposal</Trans>
  )
}
function VoteProposalSummary({ info }: { info: VoteTransactionInfo}) {
  
  return (
    <Trans>Vote {info.support?t`For`:t`Against`} proposal</Trans>
  )
}
function QueueProposalSummary({ info }: { info: QueueTransactionInfo}) {
  
  return (
    <Trans>Queue proposal</Trans>
  )
}
function ExecuteProposalSummary({ info }: { info: ExecuteTransactionInfo}) {
  
  return (
    <Trans>Execute proposal</Trans>
  )
}
function CancelProposalSummary({ info }: { info: CancelTransactionInfo}) {
  
  return (
    <Trans>Cancel proposal</Trans>
  )
}

function TransactionPopupSummary({ info }: { info: TransactionInfo }) {
  switch (info.type) {
    case TransactionType.APPROVAL:
      return <ApprovalSummary info={info}/>
    case TransactionType.MINT:
      return <MintSummary info={info}/>
    case TransactionType.ADD_CLAIM_DEV_REWARD:
      return <AddClaimDevRewardSummary info={info}/>
    case TransactionType.WITHDRAW:
      return <WithdrawSummary info={info}/>
    case TransactionType.REQUEST_RANDOM_WORDS:
      return <RequestRandomWordsSummary info={info}/>
    case TransactionType.DELEGATE:
      return <DelegateSummary info={info}/>
    case TransactionType.SUBMIT_PROPOSAL:
      return <SubmitProposalSummary info={info}/>
    case TransactionType.VOTE:
      return <VoteProposalSummary info={info}/>
    case TransactionType.QUEUE:
      return <QueueProposalSummary info={info}/>
    case TransactionType.EXECUTE:
      return <ExecuteProposalSummary info={info}/>
    case TransactionType.CANCEL:
      return <CancelProposalSummary info={info}/>
    default: return <Trans>Transaction</Trans>
  }
}

export default function TransactionPopup({ hash, removeThisPopup }: { hash: string, removeThisPopup:() => void }) {
  const { chainId } = useWeb3React()

  const tx = useTransaction(hash)

  if (!tx) return null
  const success = Boolean(tx.receipt && tx.receipt.status === 1)

  return (
      <div className='row'>
        <div className='col-2 d-flex'>
        {success ? (
           <img width={25} src={Check_Icon} alt=""/>
        ) : (
          <img width={25} src={Alert_Triangle_Icon} alt=""/>
        )}
        </div>
        <div className='col-8 d-flex justify-content-between align-items-center text-center'>
            <TransactionPopupSummary info={tx.info} />
            {chainId &&
              <a className='ms-1 text-decoration-none' 
                href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)}
                target='_blank' rel='noopener noreferrer'
                title={t`View Transaction`}
              >
                <Trans>View</Trans>
              </a>
            }
        </div>
        <div className='col-2 d-flex'><CloseButton onClick={removeThisPopup} /></div>
        
      </div>
  )
}
