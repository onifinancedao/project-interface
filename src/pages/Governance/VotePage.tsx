import { useWeb3React } from "@web3-react/core";
import JSBI from "jsbi";
import ms from "ms.macro";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from "@lingui/macro";
import { CurrencyAmount, Token } from "../../sdk-core";
import { ArrowLeft } from "react-feather";

import { AVERAGE_BLOCK_TIME_IN_SECS, DEFAULT_AVERAGE_BLOCK_TIME_IN_SECS } from "../../constants/governance";
import useCurrentBlockTimestamp from "../../hooks/useCurrentBlockTimestamp";
import useBlockNumber from "../../lib/hooks/useBlockNumber";
import { useToggleModal } from "../../state/application/hooks";
import { ApplicationModal } from "../../state/application/reducer";
import { ProposalData, ProposalState, useDevelopers, useProposalData, useProposalThreshold, useQuorum, useReceipt, useUserDelegatee, useVotesAsOfBlock } from "../../state/governance/hooks";
import { useTokenBalance } from "../../lib/hooks/useCurrencyBalance";
import { PROJECT_TOKEN } from "../../constants/tokens";
import { BIG_INT_ZERO, ZERO_ADDRESS } from "../../constants/misc";
import ThemedContainer from "../../components/ThemedContainer";
import { linkIfAddress } from ".";
import ProposalStatusSpan from "../../components/Governance/ProposalStatusSpan";
import { useUserLocale, useUserTheme } from "../../state/user/hooks";
import ActionButton from "../../components/ActionButton";
import VoteModal from "../../components/Governance/VoteModal";
import CancelModal from "../../components/Governance/CancelModal";
import QueueModal from "../../components/Governance/QueueModal";
import ExecuteModal from "../../components/Governance/ExecuteModal";
import Markdown from "../../components/Markdown";
import DecodedDataBox from "../../components/Governance/DecodedDataBox";
import ViewVotersModal from "../../components/ViewVotersModal";

function getDateFromBlock(
  targetBlock: number | undefined,
  currentBlock: number | undefined,
  averageBlockTimeInSeconds: number | undefined,
  currentTimestamp: BigNumber | undefined
): Date | undefined {
  if (targetBlock && currentBlock && averageBlockTimeInSeconds && currentTimestamp) {
    const date = new Date()
    date.setTime(
      currentTimestamp
        .add(BigNumber.from(averageBlockTimeInSeconds).mul(BigNumber.from(targetBlock - currentBlock)))
        .toNumber() * ms`1 second`
    )
    return date
  }
  return undefined
}
export default function VotePage(){
  const { id } = useParams() as { id: string }

  const { chainId, account } = useWeb3React()

  const theme = useUserTheme()

  const quorumAmount = useQuorum()

  // get data for this specific proposal
  const proposalData: ProposalData | undefined = useProposalData(id)

  // update vote option based on button interactions
  const [voteOption, setVoteOption] = useState(false)

  // modal for casting votes
  const toggleVoteModal = useToggleModal(ApplicationModal.VOTE)

  // toggle for showing queue modal
  const toggleQueueModal = useToggleModal(ApplicationModal.QUEUE)

  // toggle for showing execute modal
  const toggleExecuteModal = useToggleModal(ApplicationModal.EXECUTE)

  // toggle for showing cancel modal
  const toggleCancelModal = useToggleModal(ApplicationModal.CANCEL)

  // get and format date from data
  const currentTimestamp = useCurrentBlockTimestamp()
  const currentBlock = useBlockNumber()
  const startDate = getDateFromBlock(
    proposalData?.startBlock,
    currentBlock,
    (chainId && AVERAGE_BLOCK_TIME_IN_SECS[chainId]) ?? DEFAULT_AVERAGE_BLOCK_TIME_IN_SECS,
    currentTimestamp
  )
  const endDate = getDateFromBlock(
    proposalData?.endBlock,
    currentBlock,
    (chainId && AVERAGE_BLOCK_TIME_IN_SECS[chainId]) ?? DEFAULT_AVERAGE_BLOCK_TIME_IN_SECS,
    currentTimestamp
  )
  const now = new Date()
  const locale = useUserLocale()
  const dateFormat: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
  }

  // convert the eta to milliseconds before it's a date
  const eta = proposalData?.eta ? new Date(JSBI.toNumber(JSBI.multiply(proposalData.eta, JSBI.BigInt((ms`1 second`))))) : undefined
   
  // get total votes and format percentages for UI
  const totalVotes = proposalData?JSBI.add(proposalData.forCount, proposalData.againstCount):BIG_INT_ZERO
    
  const quorumPercentage = proposalData && quorumAmount && JSBI.GT(proposalData.forCount, BIG_INT_ZERO)?JSBI.divide(JSBI.multiply(proposalData.forCount, JSBI.BigInt(100)), quorumAmount):BIG_INT_ZERO
  const forPercentage = proposalData && JSBI.GT(proposalData.forCount, BIG_INT_ZERO)?JSBI.divide(JSBI.multiply(proposalData.forCount, JSBI.BigInt(100)), totalVotes):BIG_INT_ZERO
  const againstPercentage = JSBI.GT(totalVotes, BIG_INT_ZERO)? JSBI.subtract(JSBI.BigInt(100), forPercentage):BIG_INT_ZERO

  // only count available votes as of the proposal start block
  const availableVotes = useVotesAsOfBlock(account, proposalData?.startBlock)
  const receipt = useReceipt(proposalData?.id, account)
  function vote() { 
    if(account && proposalData && proposalData.votes && proposalData.votes.length > 0){
      const cast = proposalData.votes.filter((vote) => vote.voter === account)
      if(cast.length > 0){
        return cast[0]
      }
    }
    return undefined
  }
  const voteCast = vote()
  const toggleVotersModal = useToggleModal(ApplicationModal.VIEW_VOTERS)
  const [support, setSupport] = useState(true)
  const proposalThreshold = useProposalThreshold()
  const latestBlock = useBlockNumber()
  const proposerPriorVotes = useVotesAsOfBlock(proposalData?.proposer, (latestBlock?latestBlock - 1:undefined))
  const isProposerDev = useDevelopers(proposalData?.proposer)
  const showCancelButton = account && proposalData && proposalData.status !== ProposalState.EXECUTED && proposalData.status !== ProposalState.CANCELED && (proposalData?.proposer === account || (JSBI.LT(proposerPriorVotes, proposalThreshold) && !isProposerDev))

  // only show voting if user has > 0 votes at proposal start block and proposal is active,
  const showVotingButtons =
    availableVotes && receipt &&
    JSBI.greaterThan(availableVotes, BIG_INT_ZERO) &&
    proposalData &&
    proposalData.status === ProposalState.ACTIVE

  // we only show the button if there's an account connected and the proposal state is correct
  const showQueueButton = account && proposalData?.status === ProposalState.SUCCEEDED

  // we only show the button if there's an account connected and the proposal state is correct
  const showExecuteButton = account && proposalData?.status === ProposalState.QUEUED

  const projectTokenBalance: CurrencyAmount<Token> | undefined = useTokenBalance(
    account ?? undefined,
    chainId ? PROJECT_TOKEN : undefined
  )

  const userDelegatee: string | undefined = useUserDelegatee()

  // in blurb link to home page if they are able to unlock
  const showLinkForUnlock = Boolean(
    projectTokenBalance && JSBI.notEqual(projectTokenBalance.quotient, BIG_INT_ZERO) && userDelegatee === ZERO_ADDRESS
  )
    return(<>
      <ViewVotersModal support={support} votes={proposalData?.votes} totalVotes={support?proposalData?.forCount:proposalData?.againstCount}/>
      <VoteModal proposalId={proposalData?.id} voteOption={voteOption} />
      <QueueModal proposalId={proposalData?.id} />
      <ExecuteModal proposalId={proposalData?.id} />
      <CancelModal proposalId={proposalData?.id} />
      <div className='container-md'>
        <div className='row justify-content-center'>
          <div className='col-12 col-md-8 col-lg-8 my-4'>
            <ThemedContainer maxWidth='100%' className='p-4'>
              <div className="row">
                <div className="col-12 d-flex justify-content-between align-items-center">
                  <a className="text-decoration-none text-reset d-flex align-items-center" href="#/governance">
                    <ArrowLeft/>
                    <span className="ms-2">
                      <Trans>All Proposals</Trans>
                    </span>
                  </a>
                  <ProposalStatusSpan state={proposalData?.status}/>
                </div>
                {proposalData &&
                  <div className="col-12 my-2">
                    <div className="row">
                      <div className="col-12 my-2">
                        <span className="fs-4 fw-semibold">{proposalData.title}</span>
                      </div>
                      <div className="col-12 mb-2 text-muted">
                        {startDate && startDate > now ? (
                          <Trans>Voting starts approximately {startDate.toLocaleString(locale??'en-US', dateFormat)}</Trans>
                        ):null}
                        {endDate && proposalData &&
                          (endDate < now ? (
                            <Trans>Voting ended {endDate.toLocaleString(locale??'en-US', dateFormat)}</Trans>
                          ) : (
                            proposalData.status !== ProposalState.CANCELED?(
                              <Trans>Voting ends approximately {endDate.toLocaleString(locale??'en-US', dateFormat)}</Trans>
                            ):(
                              <Trans>Proposal canceled</Trans>
                            )
                          ))
                        }
                      </div>
                      <div className="col-12 my-1">
                        <div className={"votes-container px-2 py-2 text-center " + theme}>
                          <h6 className="ms-2 fw-semibold"><Trans>Quorum</Trans></h6>
                          <div className="progress" style={{height:"5px"}}>
                            <div className={JSBI.GT(proposalData.forCount, proposalData.againstCount)?"progress-bar bg-success":"progress-bar bg-danger"} role="progressbar" style={{width:quorumPercentage.toString()+"%"}}></div>
                          </div>
                          <small className="ms-1 text-break">
                            <Trans>{ proposalData.forCount.toString() } / { quorumAmount?.toString() } Votes</Trans>
                          </small>
                        </div>
                      </div>
                      <div className="col-6 my-1">
                        <div className={"votes-container px-2 py-2 text-center " + theme }>
                          <h6 className="ms-2 fw-semibold"><Trans>For</Trans></h6>
                          <div className="progress" style={{height:"5px"}}>
                            <div className="progress-bar bg-success" role="progressbar" style={{width:forPercentage.toString()+"%"}}></div>
                          </div>
                          <small className="ms-1 text-break">
                            <Trans>{ proposalData.forCount.toString() } Votes</Trans>
                          </small>
                          <br />
                          <small onClick={()=>{toggleVotersModal();setSupport(true)}} className="text-primary" style={{cursor:"pointer"}}><Trans>View voters for</Trans></small>
                        </div>
                      </div>
                      <div className="col-6 my-1">
                        <div className={"votes-container px-2 py-2 text-center "+theme}>
                          <h6 className="ms-2 fw-semibold"><Trans>Against</Trans></h6>
                          <div className="progress" style={{height:"5px"}}>
                            <div className="progress-bar bg-danger" role="progressbar" style={{width:againstPercentage.toString()+"%"}}></div>
                          </div>
                          <small className="ms-1 text-break">
                            <Trans>{ proposalData.againstCount.toString() } Votes</Trans>
                          </small>
                          <br />
                          <small onClick={()=>{toggleVotersModal();setSupport(false)}} className="text-primary" style={{cursor:"pointer"}}><Trans>View voters against</Trans></small>
                        </div>
                      </div>
                      <div className="col-12 my-4">
                        { proposalData && proposalData.status === ProposalState.ACTIVE && !showVotingButtons && (
                          <div>
                            <span className="text-muted">
                              <Trans>
                              Only OFP votes that were self delegated or delegated to another address before block {proposalData.startBlock} are eligible for voting.
                              </Trans>
                            </span>
                            {showLinkForUnlock && (
                              <span className="text-muted">
                                <Trans>
                                  <a className="text-decoration-none" href="#/governance">Unlock voting</a> to prepare for the next proposal.
                                </Trans>
                              </span>
                            )}
                          </div>
                        )}
                        {receipt && receipt.hasVoted && (
                          <div className={"votes-container p-3 " + theme}>
                          <div className="row">
                            <div className="col-12 text-center fs-5 mb-2 fw-semibold">
                              <Trans>Receipt</Trans>
                            </div>
                            <div className="col-12 text-center">
                              <Trans>{receipt.votes.toString()} Votes {receipt.support?t`For`:t`Against`}</Trans>
                            </div>
                            {voteCast && voteCast.reason !== "" &&
                              <div className="col-12">
                                <span className="fs-6 fw-semibold"><Trans>Reason</Trans></span>
                                <div className="mt-2">
                                  <Markdown children={voteCast.reason}></Markdown>
                                </div>
                              </div>
                            }
                          </div>
                          </div>
                        )}
                        {showVotingButtons && receipt && !receipt.hasVoted && (
                          <div className="row">
                            <div className="col-6">
                              <ActionButton 
                                onClick={() => {
                                  setVoteOption(true)
                                  toggleVoteModal()
                                }}>
                                <Trans>Vote For</Trans>
                              </ActionButton>
                            </div>
                            <div className="col-6">
                              <ActionButton 
                                onClick={() => {
                                  setVoteOption(false)
                                  toggleVoteModal()
                                }}>
                                <Trans>Vote Against</Trans>
                              </ActionButton>
                            </div>
                          </div>
                        )}
                      </div>
                      {showQueueButton && (
                        <div className="col-12 my-2">
                          <ActionButton 
                            onClick={() => {
                              toggleQueueModal()
                            }}>
                            <Trans>Queue</Trans>
                          </ActionButton>
                        </div>
                      )}
                      {showExecuteButton && (
                        <div className="col-12 my-2">
                          <div className="row">
                            {eta && (
                              <div className="col-12 mb-2">
                                <Trans>This proposal may be executed after {eta.toLocaleString(locale??'en-US', dateFormat)}.</Trans>
                              </div>
                            )}
                            <div className="col-12">
                              <ActionButton 
                                onClick={() => {
                                  toggleExecuteModal()
                                }}
                                // can't execute until the eta has arrived
                                disabled={!currentTimestamp || !proposalData?.eta || JSBI.LT(JSBI.BigInt(currentTimestamp.toString()), proposalData.eta)}>
                                <Trans>Execute</Trans>
                              </ActionButton>
                            </div>
                          </div>
                        </div>
                      )}
                      { showCancelButton &&
                      <div className="col-12 my-4">
                        <ActionButton 
                          onClick={() => {
                            toggleCancelModal()
                          }}>
                          <Trans>Cancel proposal</Trans>
                        </ActionButton>
                      </div>
                      }
                    </div>
                    <div className="col-12 my-2">
                      <p className="fs-5 fw-semibold"><Trans>Details</Trans></p>
                      <DecodedDataBox details={proposalData.details}/>
                    </div>
                    <div className="col-12 my-2 text-break">
                      <p className="fs-5 fw-semibold"><Trans>Description</Trans></p>
                      <Markdown children={proposalData?.description}/>
                    </div>
                    <div className="col-12 my-2 text-break">
                      <p className="fs-5 fw-semibold"><Trans>Proposer</Trans></p>
                        {linkIfAddress(proposalData.proposer, chainId)}
                    </div>
                  </div>
                }
                {!proposalData && <div className="col-12 my-4 text-center"><Trans>Proposal not found.</Trans></div>}
              </div>
            </ThemedContainer>
          </div>
        </div>
      </div>
    </>)
}