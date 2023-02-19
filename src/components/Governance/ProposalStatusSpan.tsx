import { Trans } from "@lingui/macro"
import { ProposalState } from "../../state/governance/hooks"

import './Status.css'

export default function ProposalStatusSpan({state}:{state:ProposalState | undefined}){
    switch (state) {
        case ProposalState.UNDETERMINED:
            return(
                <span className="status-span undetermined"><Trans>UNDETERMINED</Trans></span>
            )
        case ProposalState.PENDING:
            return(
                <span className="status-span pending"><Trans>PENDING</Trans></span>
            )
        case ProposalState.ACTIVE:
            return(
                <span className="status-span active"><Trans>ACTIVE</Trans></span>
            )
        case ProposalState.CANCELED:
            return(
                <span className="status-span canceled"><Trans>CANCELED</Trans></span>
            )
        case ProposalState.DEFEATED:
            return(
                <span className="status-span defeated"><Trans>DEFEATED</Trans></span>
            )
        case ProposalState.SUCCEEDED:
            return(
                <span className="status-span succeeded"><Trans>SUCCEEDED</Trans></span>
            )
        case ProposalState.QUEUED:
            return(
                <span className="status-span queued"><Trans>QUEUED</Trans></span>
            )
        case ProposalState.EXPIRED:
            return(
                <span className="status-span expired"><Trans>EXPIRED</Trans></span>
            )
        case ProposalState.EXECUTED:
            return(
                <span className="status-span executed"><Trans>EXECUTED</Trans></span>
            )
        default:
            return(
                <span></span>
            )
    }
    
}