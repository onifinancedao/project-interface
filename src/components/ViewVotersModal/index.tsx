import { Trans } from "@lingui/macro";
import { useWeb3React } from "@web3-react/core";
import JSBI from "jsbi";
import { useState } from "react";
import { DefaultChainId } from "../../constants/chains";

import { useCloseModal, useModalIsOpen } from "../../state/application/hooks";
import { ApplicationModal } from "../../state/application/reducer";
import { FormattedVoteCastLog } from "../../state/governance/hooks";
import { shortenAddress } from "../../utils";
import { ExplorerDataType, getExplorerLink } from "../../utils/getExplorerLink";
import CloseButton from "../CloseButton";
import Markdown from "../Markdown";
import Modal from "../Modal";
import ThemedContainer from "../ThemedContainer";

function Voter({vote}:{vote:FormattedVoteCastLog}){
    const {chainId} = useWeb3React()
    const [viewReason, setViewReason] = useState(false)
    return(
        <div className="col-12 mt-2">
           <div className="row">
                <div className="col-12 d-flex justify-content-between">
                    <div>
                        <a 
                            className="text-reset"
                            href={getExplorerLink(chainId || DefaultChainId, vote.voter, ExplorerDataType.ADDRESS)}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {shortenAddress(vote.voter)}
                        </a>
                        {vote.reason !== '' && <small onClick={()=>{setViewReason(!viewReason)}} className="text-primary ms-1" style={{cursor:"pointer"}}><Trans>reason</Trans></small>}
                    </div>
                    {vote.votes}
                </div>
                { viewReason && 
                    <div className="col-12">
                        <Markdown>{vote.reason}</Markdown>
                    </div>
                }
            </div>      
        </div>
    )
}
export default function ViewVotersModal({support, votes, totalVotes}:{support:boolean, votes: FormattedVoteCastLog[] | undefined, totalVotes: JSBI | undefined}){
    const isOpen = useModalIsOpen(ApplicationModal.VIEW_VOTERS)
    const onDismiss = useCloseModal(ApplicationModal.VIEW_VOTERS)
    const voters = votes?.filter((vote) => vote.support === support)
    return(
        <Modal isOpen={isOpen} scrollOverlay={true} onDismiss={onDismiss} maxHeight={90}>
            <ThemedContainer>
                <div className='row'>
                    <div className='col-9 mb-2'>
                        <span>{support?<Trans>Voters for</Trans>:<Trans>Voters against</Trans>}</span>
                    </div>
                    <div className='col-3 mb-2 d-flex justify-content-end'>
                        <CloseButton onClick={onDismiss} />
                    </div>
                    <div className="col-12 mt-2" style={{maxHeight:"70vh"}}>
                        <div className="row">
                            {voters?.sort(
                                (v1, v2) => (JSBI.toNumber(v1.votes) < JSBI.toNumber(v2.votes)) ? 
                                1 : 
                                (JSBI.toNumber(v1.votes) > JSBI.toNumber(v2.votes)) ? 
                                -1 : 0
                                ).map((voter, i)=> {return <Voter key={i} vote={voter}/>})
                            }
                        </div>
                    </div>
                    <div className="col.12 mt-4 d-flex justify-content-between fw-semibold">
                    <span>{support?<Trans>Total votes for</Trans>:<Trans>Total votes against</Trans>}</span>
                    <span>{totalVotes?.toString()}</span>
                    </div>
                </div>
            </ThemedContainer>
        </Modal>
    )
}