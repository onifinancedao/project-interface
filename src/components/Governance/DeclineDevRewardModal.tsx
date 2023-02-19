import { Trans } from "@lingui/macro";
import JSBI from "jsbi";
import { CORE_ADDRESS } from "../../constants/addresses";

import { encodeData } from "../../pages/Governance";
import { useCloseModal, useModalIsOpen } from "../../state/application/hooks";
import { ApplicationModal } from "../../state/application/reducer";
import { ProposalDetail } from "../../state/governance/hooks";
import ActionButton from "../ActionButton";
import CloseButton from "../CloseButton";
import Modal from "../Modal";
import ThemedContainer from "../ThemedContainer";
import DecodedDataBox from "./DecodedDataBox";

export default function DeclineDevRewardModal({addProposalDetail}:{addProposalDetail:(proposalDetail: ProposalDetail) => void}){
    const isOpen = useModalIsOpen(ApplicationModal.PROPOSAL_ACTION_DECLINE_DEV_REWARD)
    const onDismiss = useCloseModal(ApplicationModal.PROPOSAL_ACTION_DECLINE_DEV_REWARD)
    
    const {encodedData} = encodeData('setTempLock(bool)', 'false')
    
    const action:ProposalDetail = {
        target: CORE_ADDRESS,
        functionSig: 'setTempLock(bool)',
        callData: encodedData,
        value: JSBI.BigInt(0),
    }

    const handleAddAction = () =>{
        addProposalDetail(action)
        onDismiss()
    }
    return(
        <Modal isOpen={isOpen} scrollOverlay={true} onDismiss={onDismiss} maxHeight={90}>
            <ThemedContainer>
                <div className='row'>
                    <div className='col-9 mb-2'>
                        <span><Trans>Decline dev reward</Trans></span>
                    </div>
                    <div className='col-3 mb-2 d-flex justify-content-end'>
                        <CloseButton onClick={onDismiss} />
                    </div>
                    <div className="col-12 mt-2">
                        <Trans>Reject the developer's final reward request.</Trans>
                    </div>
                    <div className="col-12 mt-2 text-center">
                        <DecodedDataBox details={[action]} counter={false}/>
                    </div>
                    <div className='col-12 text-center d-grid gap-2 my-2'>
                        <ActionButton onClick={handleAddAction}>
                            <Trans>Add action</Trans>
                        </ActionButton>
                    </div>
                </div>
            </ThemedContainer>
        </Modal>
    )
}