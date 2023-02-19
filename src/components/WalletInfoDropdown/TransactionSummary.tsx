import { useWeb3React } from "@web3-react/core"
import { useMemo } from "react"

import { TransactionDetails } from "../../state/transactions/types"
import { ExplorerDataType, getExplorerLink } from "../../utils/getExplorerLink"
import { Loader } from "../Loader"
import Check_Icon from "../../assets/svg/check-icon.svg"
import Alert_Triangle_Icon from "../../assets/svg/alert-triangle-icon.svg"
import TransactionBody from "./TransactionBody"
import { useUserTheme } from "../../state/user/hooks"

export enum TransactionState {
    Pending,
    Success,
    Failed,
  }

export const TransactionSummary = ({ transactionDetails }: { transactionDetails: TransactionDetails }) => {
    const { chainId = 1 } = useWeb3React()
    const theme = useUserTheme()
    const tx = transactionDetails
    
    const { info, receipt, hash } = tx
  
    const transactionState = useMemo(() => {
      const pending = !receipt
      const success = !pending && tx && (receipt?.status === 1 || typeof receipt?.status === 'undefined')
      const transactionState = pending
        ? TransactionState.Pending
        : success
        ? TransactionState.Success
        : TransactionState.Failed
  
      return transactionState
    }, [receipt, tx])
  
    return chainId ? (
        <a  className={"py-2 px-3 d-flex text-reset text-decoration-none justify-content-between settings-menu-item " + theme}
            target='_blank' 
            rel='noopener noreferrer'
            href={getExplorerLink(chainId??1, hash, ExplorerDataType.TRANSACTION)}
        >
                <TransactionBody info={info} transactionState={transactionState} />
            {transactionState === TransactionState.Pending ? (
                <Loader width={24} height={24}/>
            ) : transactionState === TransactionState.Success ? (
                <img src={Check_Icon} alt=""/>
            ) : (
                <img src={Alert_Triangle_Icon} alt=""/>
            )}
        </a>
    ) : null
  }