import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import JSBI from 'jsbi'
import { useState } from 'react'
import { CurrencyAmount, Token } from '../../sdk-core'

import DelegateModal from '../../components/Governance/DelegateModal'
import ProposalStatusSpan from '../../components/Governance/ProposalStatusSpan'
import IdentIcon from '../../components/IdentIcon'
import { Loader } from '../../components/Loader'
import ThemedContainer from '../../components/ThemedContainer'
import { BIG_INT_ZERO, ZERO_ADDRESS } from '../../constants/misc'
import { PROJECT_TOKEN } from '../../constants/tokens'
import { useTokenBalance } from '../../lib/hooks/useCurrencyBalance'
import { useToggleModal } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/reducer'
import { ProposalData, ProposalState, useAllProposalData, useProposalThreshold, useUserDelegatee, useUserVotes } from '../../state/governance/hooks'
import { useUserTheme } from '../../state/user/hooks'
import { shortenAddress } from '../../utils'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'

function ProposalItem({proposal}:{proposal:ProposalData}) {
    const theme = useUserTheme()
    return(
        <a href={"#/governance/" + proposal.id} className={'col-12 my-1 text-decoration-none text-reset themed-container ' + theme}>
            <div className='row'>
                <div className='col-1 d-flex align-items-center text-muted'>{proposal.id}</div>
                <div className='col-5 col-sm-7 col-md-8 col-lg-8 d-flex align-items-center'>{proposal.title}</div>
                <div className='col-6 col-sm-4 col-md-3 col-lg-3 d-flex align-items-center justify-content-end'>
                <ProposalStatusSpan state={proposal.status}/>
                </div>
            </div>
        </a>
    )
}
export default function Proposals() {
    const { account, chainId } = useWeb3React()
    const {data: allProposals, loading: loadingProposals } = useAllProposalData()
    const proposalThreshold = useProposalThreshold()
    
    const { loading: loadingAvailableVotes, votes: availableVotes } = useUserVotes()

    const projectTokenBalance: CurrencyAmount<Token> | undefined = useTokenBalance(
        account ?? undefined,
        chainId ? PROJECT_TOKEN : undefined
    )
    
    // toggle for showing delegation modal
    const toggleDelegateModal = useToggleModal(ApplicationModal.DELEGATE)

    const userDelegatee: string | undefined = useUserDelegatee()
    
    // show delegation option if they have have a balance, but have not delegated
    const showUnlockVoting = Boolean(
        projectTokenBalance && JSBI.notEqual(projectTokenBalance.quotient, JSBI.BigInt(0)) && userDelegatee === ZERO_ADDRESS
    )
    const [showCancelled, setShowCancelled] = useState(false);
    return (<>
        <DelegateModal/>
        <div className='container-md'>
            <div className='row justify-content-center'>
                <div className='col-12 col-md-8 col-lg-8 my-4'>
                    <div className='row'>
                        <div className='col-12 px-0'>
                            <ThemedContainer maxWidth='100%' className='p-4'>
                                <div><strong><span><Trans>Onifinance Project Governance</Trans></span></strong></div>
                                <div className='my-2'><small><Trans>The OFP tokens represent voting shares in the governance of the Onifinance Project. You can vote on each proposal yourself or delegate your votes to a third party.</Trans></small></div>
                                <a href="#/faq" className='text-reset' style={{maxWidth:"450px", cursor:"pointer"}}><Trans>FAQs</Trans></a>
                            </ThemedContainer>
                        </div>
                        {   account && userDelegatee && projectTokenBalance &&
                            <div className='col-12 mt-4'>
                                <div className='row'>
                                    
                                    <div className='col-12 col-lg-6 mb-2 mb-lg-0 d-grid d-md-flex justify-content-center justify-content-lg-start align-items-center'>
                                    {JSBI.GT(projectTokenBalance.quotient, BIG_INT_ZERO) && userDelegatee !== ZERO_ADDRESS &&
                                        (userDelegatee === account?
                                            <Trans>{projectTokenBalance?.toExact()} self-delegated votes.</Trans>:
                                            <>
                                            <Trans>{projectTokenBalance?.toExact()} votes delegated to: </Trans>
                                            <a className="text-reset d-flex justify-content-center ms-2" href={getExplorerLink(chainId || 1, userDelegatee, ExplorerDataType.ADDRESS)} target='_blank' rel="noopener noreferrer">
                                                <p className='mb-0 me-2'>{shortenAddress(userDelegatee)}</p>
                                                <IdentIcon address={userDelegatee}/>
                                            </a>
                                            </>
                                        )}
                                    {JSBI.EQ(projectTokenBalance.quotient, BIG_INT_ZERO) && userDelegatee === account &&<Trans>Self-delegated!</Trans>}
                                    </div>
                                    <div className='col-12 col-lg-6 d-flex justify-content-center justify-content-lg-end align-items-center'>
                                        {   showUnlockVoting && projectTokenBalance?
                                            <button className='btn btn-outline-primary' onClick={toggleDelegateModal}>
                                                <Trans>Unlock {projectTokenBalance.toExact()} Votes</Trans>
                                            </button>
                                            :
                                            <button className='btn btn-outline-primary' onClick={toggleDelegateModal}>
                                                { account === userDelegatee? <Trans>Update delegate</Trans>: <Trans>Self-delegate</Trans>}
                                            </button>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                        {availableVotes && 
                        <div className='col-12 text-end mt-4'>
                            <Trans>{availableVotes.toExact()} Current votes</Trans>
                        </div>}
                        <div className= 'col-4 my-4 col-lg-6 d-flex align-items-center'>
                            <h4 className='m-0'><Trans>Proposals</Trans></h4>
                        </div>
                        <div className= {'col-8 justify-content-end col-lg-6 my-4 d-flex align-items-center justify-content-lg-end'}>
                            <a href='#/governance/create-proposal' className="btn btn-primary ms-2" role="button" aria-disabled="true"><Trans>Create proposal</Trans></a>
                        </div>
                        {!loadingProposals && !loadingAvailableVotes && allProposals.length > 0 &&
                        <div className='col-12 mb-2 d-flex justify-content-between align-items-center'>
                            <span className='text-muted'><Trans>Show Cancelled</Trans></span>
                            <div className="form-check form-switch">
                                <input onChange={()=>{setShowCancelled(!showCancelled)}} checked={showCancelled} className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"/>
                            </div>
                        </div>
                        }
                        {
                            loadingProposals || loadingAvailableVotes ? <div className='col-12 my-4 d-flex justify-content-center'><Loader/></div>: null
                        }
                        {
                            !loadingProposals && !loadingAvailableVotes && allProposals.length > 0 && allProposals.slice(0).reverse().map((proposal, index)=>{
                                if(!showCancelled){
                                    if(proposal.status !== ProposalState.UNDETERMINED && proposal.status !== ProposalState.CANCELED){
                                        return(<ProposalItem key={index} proposal={proposal}/>)
                                    }
                                }else{
                                    return(<ProposalItem key={index} proposal={proposal}/>)
                                }
                            })
                                
                        }
                        {
                            !loadingProposals && !loadingAvailableVotes && allProposals.length === 0 &&
                            <div className='col-12 my-1'>
                                <ThemedContainer maxWidth='100%' className='text-center'>
                                    <h5><Trans>No proposals found.</Trans></h5>
                                    <small><Trans>Proposals submitted by community members will appear here.</Trans></small>
                                </ThemedContainer>
                            </div>
                        }
                        <div className='col-12 text-center mt-4'>
                            <small><Trans>A minimum threshold of 10 votes is required to submit proposals</Trans></small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}