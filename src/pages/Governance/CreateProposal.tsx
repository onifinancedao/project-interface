import { t, Trans } from "@lingui/macro";
import { useWeb3React } from "@web3-react/core"
import { getAddress } from "@ethersproject/address"; 
import JSBI from "jsbi";
import { ChangeEvent, useCallback, useState } from "react";

import { ArrowLeft } from "react-feather";
import ActionButton from "../../components/ActionButton";
import ActivateEmergencyModal from "../../components/Governance/ActivateEmergencyModal";
import CommunityRaffleModal from "../../components/Governance/CommunityRaffleModal";
import CustomActionModal from "../../components/Governance/CustomActionModal";
import DeclineDevRewardModal from "../../components/Governance/DeclineDevRewardModal";
import PreviewProposalModal from "../../components/Governance/PreviewProposalModal";
import TransferOrApproveModal from "../../components/Governance/TransferOrApproveModal";
import ThemedContainer from "../../components/ThemedContainer";
import { useToggleModal } from "../../state/application/hooks";
import { ApplicationModal } from "../../state/application/reducer";
import { useDev } from "../../state/dev/hooks";
import { CreateProposalData, ProposalDetail, ProposalState, useDevelopers, useLatestProposalId, useProposalData, useProposalThreshold, useUserVotes } from "../../state/governance/hooks"
import { useCurrentStep } from "../../state/roadMap/hooks";
import { useUserTheme } from "../../state/user/hooks";

import DecodedDataBox from "../../components/Governance/DecodedDataBox";

export default function CreateProposal(){
    const { account } = useWeb3React()
    
    const isDev = useDevelopers(account)
    const latestProposalId = useLatestProposalId(account ?? undefined) ?? '0'
    const latestProposalData = useProposalData(latestProposalId)
    const { votes: availableVotes } = useUserVotes()
    const proposalThreshold = useProposalThreshold()
    const theme = useUserTheme()
    const currentStep = useCurrentStep()
    const dev = useDev()
    
    const [titleValue, setTitleValue] = useState('')
    const [bodyValue, setBodyValue] = useState('')
    const [proposalDetails, setProposalDetails] = useState<ProposalDetail[]>([])
    
    const [proposalData, setProposalData] = useState<CreateProposalData | undefined>()
    
    const addProposalDetail = (proposalDetail:ProposalDetail) => {
        let newProposalDetails = proposalDetails
        newProposalDetails.push(proposalDetail)
        setProposalDetails(newProposalDetails)
    }

    const hasEnoughVote = Boolean(
        availableVotes && proposalThreshold && (JSBI.greaterThanOrEqual(availableVotes.quotient, proposalThreshold) || isDev)
    )
    
    const hasActiveProposal = Boolean(
        latestProposalData?.status === ProposalState.ACTIVE ||
        latestProposalData?.status === ProposalState.PENDING
    )
    
    const toggleTransferOrApproveModal = useToggleModal(ApplicationModal.PROPOSAL_ACTION_TRANSFER_APPROVE)
    const toggleActivateEmergencyModal = useToggleModal(ApplicationModal.PROPOSAL_ACTION_ACTIVATE_EMERGENCY)
    const toggleDeclineDevRewardModal = useToggleModal(ApplicationModal.PROPOSAL_ACTION_DECLINE_DEV_REWARD)
    const toggleCommunityRaffleModal = useToggleModal(ApplicationModal.PROPOSAL_ACTION_COMMUNITY_RAFFLE)
    const toggleCustomModal = useToggleModal(ApplicationModal.PROPOSAL_ACTION_CUSTOM)
    const togglePreviewModal = useToggleModal(ApplicationModal.PROPOSAL_PREVIEW)

    const handleTitleInput = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
          const input = event.target.value
          setTitleValue(input)
        },
        [setTitleValue]
    )

    const handleBodyInput = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement>) => {
          const input = event.target.value
          setBodyValue(input)
        },
        [setBodyValue]
    )
    
    const handlePreview = () => {
        const createProposalData: CreateProposalData = {} as CreateProposalData
        createProposalData.targets = []
        createProposalData.values = []
        createProposalData.signatures = []
        createProposalData.calldatas = []
        for (let i = 0; i < proposalDetails.length; i++) {
            //target
            createProposalData.targets[i] = getAddress(proposalDetails[i].target)
            //value
            createProposalData.values[i] = proposalDetails[i].value.toString()
            //signature
            createProposalData.signatures[i] = proposalDetails[i].functionSig
            //calldata
            createProposalData.calldatas[i] = proposalDetails[i].callData
        }
        createProposalData.description = `# ${titleValue}

${bodyValue}
`
        setProposalData(createProposalData)
        togglePreviewModal()
    }
    return(
        <>
        <TransferOrApproveModal addProposalDetail={addProposalDetail}/>
        <ActivateEmergencyModal addProposalDetail={addProposalDetail}/>
        <DeclineDevRewardModal addProposalDetail={addProposalDetail}/>
        <CommunityRaffleModal addProposalDetail={addProposalDetail}/>
        <CustomActionModal addProposalDetail={addProposalDetail}/>
        <PreviewProposalModal proposalData={proposalData}/>
        <div className='container-md'>
            <div className='row justify-content-center'>
                <div className='col-12 col-md-8 col-lg-8 my-4'>
                    <ThemedContainer maxWidth='100%' className='p-4'>
                        <div className="row">
                            <div className="col-12 d-flex align-items-center">
                                <a className="text-reset" href="#/governance">
                                    <ArrowLeft/>
                                </a>
                                <h4 className="mb-0 mx-auto"><Trans>Create Proposal</Trans></h4>
                            </div>
                            <div className="col-12 my-4">
                                <h5><Trans>Action list</Trans></h5>
                                <div className="px-3 py-2">
                                    <div className=" row text-center overflow-auto action-list">
                                        <button className={"col-12 action-list-item start " + theme} 
                                            onClick={toggleTransferOrApproveModal}
                                        >
                                            <span><Trans>Transfer or Approve</Trans></span>
                                        </button>
                                        <button className={"col-12 action-list-item " + theme} 
                                            onClick={toggleActivateEmergencyModal}
                                        >
                                            <span><Trans>Activate emergency</Trans></span>
                                        </button>
                                        <button className={"col-12 action-list-item " + theme} 
                                            onClick={toggleDeclineDevRewardModal}
                                        >
                                            <span><Trans>Decline dev reward</Trans></span>
                                        </button>
                                        
                                        {  account && dev && account === dev && currentStep && JSBI.EQ(currentStep, JSBI.BigInt(9)) && <button className={"col-12 action-list-item " + theme} 
                                            onClick={toggleCommunityRaffleModal}
                                        >
                                            <span><Trans>Giveaway on twitter</Trans></span>
                                        </button>}
                                        <button className={"col-12 action-list-item end " + theme} 
                                            onClick={toggleCustomModal}
                                        >
                                            <span><Trans>Custom action</Trans></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 my-2">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="mb-0"><Trans>Detail</Trans></h6>
                                    {proposalDetails.length > 0 && <button onClick={()=>{setProposalDetails([])}} type="button" className="btn btn-outline-danger btn-sm"><Trans>Clear all</Trans></button>}
                                </div>
                                <div className={"proposal-input-container px-3 py-2 " + theme}
                                    style={{minHeight:"100px"}}
                                >
                                    <DecodedDataBox details={proposalDetails}/>
                                    {(proposalDetails.length === 0) && <span><Trans>Select action</Trans></span>}
                                </div>
                            </div>
                            <div className="col-12 my-2">
                                <h5><Trans>Proposal</Trans></h5>
                                <a className="text-decoration-none"  href="https://remarkjs.github.io/react-markdown/" target="_blank" rel="noopener noreferrer"><Trans>Markdown editor</Trans></a>
                                <div className={"proposal-input-container mt-2 px-3 py-2 " + theme} style={{minHeight:"600px"}}>
                                    <input onChange={handleTitleInput} type="text" className={"proposal-input text-center mt-2 " + theme} id="proposalTitle" placeholder={t`Proposal title`} autoComplete="off"/>
                                    <hr />
                                    <textarea onChange={handleBodyInput} className={"proposal-input " + theme} id="proposalDescription" placeholder={t`Description`} cols={30} rows={20} style={{width:"100%"}} autoComplete="off"></textarea>
                                </div>
                            </div>
                            <div className="col-12">
                                {account && hasEnoughVote && !hasActiveProposal && <ActionButton onClick={handlePreview} disabled={titleValue === '' || bodyValue === '' || !(proposalDetails.length >= 0 && proposalDetails.length <= 10)}><Trans>Preview Proposal</Trans></ActionButton>}
                                {account && hasEnoughVote && hasActiveProposal && <ActionButton disabled={true}><Trans>You already have an active or pending proposal</Trans></ActionButton>}
                                {account && !hasEnoughVote && proposalThreshold &&<ActionButton disabled={true}><Trans>You must have {proposalThreshold?.toString()} votes to submit a proposal</Trans></ActionButton>}
                                {account && !hasEnoughVote && !proposalThreshold &&<ActionButton disabled={true}><Trans>You don't have enough votes to submit a proposal</Trans></ActionButton>}
                                {!account && <ActionButton disabled={true}><Trans>Preview Proposal</Trans></ActionButton>}
                            </div>
                        </div>
                    </ThemedContainer>
                </div>
            </div>
        </div>
        </>
    )
}