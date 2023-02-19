import { t, Trans } from "@lingui/macro";
import { PROJECT_TOKEN, USD_TOKEN } from "../../constants/tokens";
import { useToken } from "../../hooks/Tokens";
import { CurrencyAmount } from "../../sdk-core";
import { AddClaimDevRewardTransactionInfo, ApproveTransactionInfo, MintTransactionInfo, TransactionInfo, TransactionType, WithdrawTransactionInfo, VoteTransactionInfo, QueueTransactionInfo, ExecuteTransactionInfo, CancelTransactionInfo, ExchangeTransactionInfo, BurnTransactionInfo } from "../../state/transactions/types";
import tryParseCurrencyAmount from "../../utils/tryParseCurrencyAmount";
import { TransactionState } from "./TransactionSummary";

interface ActionProps {
    pending: JSX.Element
    success: JSX.Element
    failed: JSX.Element
    transactionState: TransactionState
  }
  
  const Action = ({ pending, success, failed, transactionState }: ActionProps) => {
    switch (transactionState) {
      case TransactionState.Failed:
        return failed
      case TransactionState.Success:
        return success
      default:
        return pending
    }
  }

const FailedText = ({ transactionState }: { transactionState: TransactionState }) =>
  transactionState === TransactionState.Failed ? <span className="ms-1"><Trans>failed</Trans></span> : <span />

const ApprovalSummary = ({
    info,
    transactionState,
  }: {
    info: ApproveTransactionInfo
    transactionState: TransactionState
  }) => {

    const actionProps = {
      transactionState,
      pending: <Trans>Approving</Trans>,
      success: <Trans>Approved</Trans>,
      failed: <Trans>Approve</Trans>,
    }
    
    const token = useToken(info.tokenAddress)

    return (
      <div>
        <Action {...actionProps} /> <span className="ms-1">{token?.symbol}</span>{' '}
        <FailedText transactionState={transactionState} />
      </div>
    )
}

const MintSummary = ({
    info,
    transactionState,
  }: {
    info: MintTransactionInfo
    transactionState: TransactionState
  }) => {

    const actionProps = {
      transactionState,
      pending: <Trans>Minting</Trans>,
      success: <Trans>Minted</Trans>,
      failed: <Trans>Mint</Trans>,
    }
    
    

    return (
      <div className="d-flex">
        <Action {...actionProps} /> <span className="ms-1">{ tryParseCurrencyAmount(info.projectTokenAmountRaw,PROJECT_TOKEN)?.toSignificant() } {PROJECT_TOKEN.symbol}</span>{' '}
        <FailedText transactionState={transactionState} />
      </div>
    )
}

const AddClaimableBalanceSummary = ({
    info,
    transactionState,
  }: {
    info: AddClaimDevRewardTransactionInfo
    transactionState: TransactionState
  }) => {

  const actionProps = {
    transactionState,
    pending: <Trans>Adding</Trans>,
    success: <Trans>Aded</Trans>,
    failed: <Trans>Add</Trans>,
  }    
  
  return (
    <div className="d-flex">
      <Action {...actionProps} /> <span className="ms-1">{ info.usdAmount } {USD_TOKEN.symbol}</span>{' '}
      <FailedText transactionState={transactionState} />
    </div>
  )
}

const WithdrawSummary = ({
  info,
  transactionState,
}: {
  info: WithdrawTransactionInfo
  transactionState: TransactionState
}) => {

const actionProps = {
  transactionState,
  pending: <Trans>withdrawing</Trans>,
  success: <Trans>withdrew</Trans>,
  failed: <Trans>Withdraw</Trans>,
}    
const token = useToken(info.currencyAddress??'')
return (
  <div className="d-flex">
    <Action {...actionProps} /> <span className="ms-1">{ token && info.currencyAmountRaw && CurrencyAmount.fromRawAmount(token, info.currencyAmountRaw).toExact()} { token?.symbol }</span>{' '}
    <FailedText transactionState={transactionState} />
  </div>
)
}

const RequestRandomWordsSummary = ({
  transactionState,
}: {
  transactionState: TransactionState
}) => {

const actionProps = {
  transactionState,
  pending: <Trans>Requesting</Trans>,
  success: <Trans>Requested</Trans>,
  failed: <Trans>Request</Trans>,
}    

return (
  <div className="d-flex">
    <Action {...actionProps} /> <span className="ms-1"><Trans>random words</Trans></span>{' '}
    <FailedText transactionState={transactionState} />
  </div>
)
}
const DelegateSummary = ({
  transactionState,
}: {
  transactionState: TransactionState
}) => {

const actionProps = {
  transactionState,
  pending: <Trans>Updating delegate</Trans>,
  success: <Trans>Updated delegate</Trans>,
  failed: <Trans>Update delegate</Trans>,
}    

return (
  <div className="d-flex">
    <Action {...actionProps} /> <span className="ms-1"></span>{' '}
    <FailedText transactionState={transactionState} />
  </div>
)
}
const SubmitProposalSummary = ({
  transactionState,
}: {
  transactionState: TransactionState
}) => {

const actionProps = {
  transactionState,
  pending: <Trans>Submitting proposal</Trans>,
  success: <Trans>Proposal submitted</Trans>,
  failed: <Trans>Submit proposal</Trans>,
}    

return (
  <div className="d-flex">
    <Action {...actionProps} /> <span className="ms-1"></span>{' '}
    <FailedText transactionState={transactionState} />
  </div>
)
}
const VoteProposalSummary = ({
  info,
  transactionState,
}: {
  info: VoteTransactionInfo
  transactionState: TransactionState
}) => {

const actionProps = {
  transactionState,
  pending: <Trans>Votting {info.support?t`For`:t`Against`} proposal</Trans>,
  success: <Trans>Votted {info.support?t`For`:t`Against`} proposal</Trans>,
  failed: <Trans>Vote {info.support?t`For`:t`Against`} proposal</Trans>,
}    

return (
  <div className="d-flex">
    <Action {...actionProps} /> <span className="ms-1">{info.proposalId}</span>{' '}
    <FailedText transactionState={transactionState} />
  </div>
)
}
const QueueProposalSummary = ({
  info,
  transactionState,
}: {
  info: QueueTransactionInfo
  transactionState: TransactionState
}) => {

const actionProps = {
  transactionState,
  pending: <Trans>Queuing proposal</Trans>,
  success: <Trans>Proposal queued</Trans>,
  failed: <Trans>Queue proposal</Trans>,
}    

return (
  <div className="d-flex">
    <Action {...actionProps} /> <span className="ms-1">{info.proposalId}</span>{' '}
    <FailedText transactionState={transactionState} />
  </div>
)
}
const ExecuteProposalSummary = ({
  info,
  transactionState,
}: {
  info: ExecuteTransactionInfo
  transactionState: TransactionState
}) => {

const actionProps = {
  transactionState,
  pending: <Trans>Executing proposal</Trans>,
  success: <Trans>Proposal executed</Trans>,
  failed: <Trans>Execute proposal</Trans>,
}    

return (
  <div className="d-flex">
    <Action {...actionProps} /> <span className="ms-1">{info.proposalId}</span>{' '}
    <FailedText transactionState={transactionState} />
  </div>
)
}
const CancelProposalSummary = ({
  info,
  transactionState,
}: {
  info: CancelTransactionInfo
  transactionState: TransactionState
}) => {

const actionProps = {
  transactionState,
  pending: <Trans>Canceling proposal</Trans>,
  success: <Trans>Proposal canceled</Trans>,
  failed: <Trans>Cancel proposal</Trans>,
}    

return (
  <div className="d-flex">
    <Action {...actionProps} /> <span className="ms-1">{info.proposalId}</span>{' '}
    <FailedText transactionState={transactionState} />
  </div>
)
}

const ExchangeSummary = ({
  info,
  transactionState,
}: {
  info: ExchangeTransactionInfo
  transactionState: TransactionState
}) => {

const actionProps = {
  transactionState,
  pending: <Trans>Exchanging</Trans>,
  success: <Trans>Exchanged</Trans>,
  failed: <Trans>Exchange</Trans>,
}    

return (
  <div className="d-flex">
    <Action {...actionProps} /> <span className="ms-1">{info.projectTokenAmountRaw} {PROJECT_TOKEN.symbol}</span>{' '}
    <FailedText transactionState={transactionState} />
  </div>
)
}

const BurnSummary = ({
  info,
  transactionState,
}: {
  info: BurnTransactionInfo
  transactionState: TransactionState
}) => {

const actionProps = {
  transactionState,
  pending: <Trans>Burning</Trans>,
  success: <Trans>Burned</Trans>,
  failed: <Trans>Burn</Trans>,
}    

return (
  <div className="d-flex">
    <Action {...actionProps} /> <span className="ms-1">{info.projectTokenAmountRaw} {PROJECT_TOKEN.symbol}</span>{' '}
    <FailedText transactionState={transactionState} />
  </div>
)
}

const TransactionBody = ({ info, transactionState }: { info: TransactionInfo; transactionState: TransactionState }) => {
  switch (info.type) {
    case TransactionType.APPROVAL:
      return <ApprovalSummary info={info} transactionState={transactionState}/>
    case TransactionType.MINT:
      return <MintSummary info={info} transactionState={transactionState}/>
    case TransactionType.ADD_CLAIM_DEV_REWARD:
      return <AddClaimableBalanceSummary info={info} transactionState={transactionState}/>
    case TransactionType.WITHDRAW:
      return <WithdrawSummary info={info} transactionState={transactionState}/>
    case TransactionType.REQUEST_RANDOM_WORDS:
      return <RequestRandomWordsSummary transactionState={transactionState}/>
    case TransactionType.DELEGATE:
      return <DelegateSummary transactionState={transactionState}/>
    case TransactionType.SUBMIT_PROPOSAL:
      return <SubmitProposalSummary transactionState={transactionState}/>
      case TransactionType.VOTE:
      return <VoteProposalSummary info={info} transactionState={transactionState}/>
      case TransactionType.QUEUE:
      return <QueueProposalSummary info={info} transactionState={transactionState}/>
      case TransactionType.EXECUTE:
      return <ExecuteProposalSummary info={info} transactionState={transactionState}/>
      case TransactionType.CANCEL:
      return <CancelProposalSummary info={info} transactionState={transactionState}/>
      case TransactionType.EXCHANGE:
        return <ExchangeSummary info={info} transactionState={transactionState}/>
      case TransactionType.BURN:
        return <BurnSummary info={info} transactionState={transactionState}/>
    default:
      return <span><Trans>Transaction</Trans></span>
  }
}
  
  export default TransactionBody