import { Trans } from "@lingui/macro";
import { isAddress } from "ethers/lib/utils";
import JSBI from "jsbi";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { CORE_ADDRESS } from "../../constants/addresses";

import { encodeData } from "../../pages/Governance";
import { useCloseModal, useModalIsOpen } from "../../state/application/hooks";
import { ApplicationModal } from "../../state/application/reducer";
import { ProposalDetail } from "../../state/governance/hooks";
import { useUserTheme } from "../../state/user/hooks";
import ActionButton from "../ActionButton";
import CloseButton from "../CloseButton";
import Modal from "../Modal";
import ThemedContainer from "../ThemedContainer";
import DecodedDataBox from "./DecodedDataBox";

export default function CommunityRaffleModal({addProposalDetail}:{addProposalDetail:(proposalDetail: ProposalDetail) => void}){
    
    const isOpen = useModalIsOpen(ApplicationModal.PROPOSAL_ACTION_COMMUNITY_RAFFLE)
    const onDismiss = useCloseModal(ApplicationModal.PROPOSAL_ACTION_COMMUNITY_RAFFLE)
    
    const [action, setAction] = useState<ProposalDetail>(
        {
            target: CORE_ADDRESS,
            functionSig: 'communityRaffle(tuple(uint,address,string,string)[])',
            callData: '',
            value: JSBI.BigInt(0)
        }
    )
    const [count, setCount] = useState(0)
    const [callData, setCallData] = useState<any[][]>([[]])
    const [name, setName] = useState('')
    const [to, setTo] = useState('')
    const [evidence, setEvidence] = useState('')
    const [validData, setValidData] = useState(false)
    const toRef = useRef<HTMLInputElement>(null)
    const nameRef = useRef<HTMLInputElement>(null)
    const evidenceRef = useRef<HTMLInputElement>(null)
    const handleNameInput = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
          const input = event.target.value
          const withoutSpaces = input.replace(/\s+/g, '')
          setName(withoutSpaces)
        },
        [setName]
    )

    const handleToInput = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
          const input = event.target.value
          const withoutSpaces = input.replace(/\s+/g, '')
          setTo(withoutSpaces)
          if(withoutSpaces === ''){
            event.target.classList.remove('is-invalid')
            event.target.classList.remove('is-valid')
          }else if(isAddress(withoutSpaces)){
            event.target.classList.remove('is-invalid')
            event.target.classList.add('is-valid')
          }else{
            event.target.classList.remove('is-valid')
            event.target.classList.add('is-invalid')
          }
        },
        [setTo]
    )
    
    const handleEvidenceInput = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
          const input = event.target.value
          const withoutSpaces = input.replace(/\s+/g, '')
          setEvidence(withoutSpaces)
        },
        [setEvidence]
    )
    
    const cleanForm = () => {
        
        if(toRef.current)toRef.current.value = ''
        if(nameRef.current)nameRef.current.value = ''
        if(evidenceRef.current)evidenceRef.current.value = ''
        
    }

    const handleAddWinner = () => {
        let nc = callData
        nc[0].push([count,to,name,evidence])
        const {encodedData, error} = encodeData(action.functionSig, JSON.stringify(nc))
        if(!error){
            setCallData(nc)
            setAction({
                target: action.target,
                functionSig: action.functionSig,
                callData: encodedData,
                value: action.value,
            })
            setCount(count + 1)
            cleanForm()
        }else{
            setValidData(!error)
        }
    }
    
    const handleAddAction = () => {
        addProposalDetail(action)
        setCount(0)
        setCallData([[]])
        cleanForm()
        setValidData(false)
        onDismiss()
    }
    const theme = useUserTheme()

    return(
        <Modal isOpen={isOpen} scrollOverlay={true} onDismiss={onDismiss} maxHeight={80}>
            <ThemedContainer maxHeight="80vh" className="overflow-auto">
                <div className='row'>
                    <div className='col-9 mb-2'>
                        <span><Trans>Community Raffle</Trans></span>
                    </div>
                    <div className='col-3 mb-2 d-flex justify-content-end'>
                        <CloseButton onClick={onDismiss} />
                    </div>
                    <div className="col-12 mt-2">
                        <span><Trans>Winner #{count}</Trans></span>
                    </div>
                    <div className="col-12 mt-2">
                        <div className="form-floating">
                            <input ref={toRef} onChange={handleToInput} type="text" name="" id="to" autoComplete="off" className={"form-control " + theme}/>
                            <label htmlFor="to"><Trans>To</Trans></label>
                        </div>
                    </div>
                    <div className="col-12 mt-2">
                        <div className="form-floating">
                            <input ref={nameRef} onChange={handleNameInput} type="text" name="" id="name" autoComplete="off" className={"form-control " + theme}/>
                            <label htmlFor="name"><Trans>Name</Trans></label>
                        </div>
                    </div>
                    <div className="col-12 mt-2">
                        <div className="form-floating">
                            <input ref={evidenceRef} onChange={handleEvidenceInput} type="text" name="" id="evidence" autoComplete="off" className={"form-control " + theme}/>
                            <label htmlFor="evidence"><Trans>Evidence</Trans></label>
                        </div>
                    </div>
                    {count < 50 && <div className='col-12 text-center d-grid gap-2 my-2'>
                        <ActionButton onClick={handleAddWinner}>
                            <Trans>Add winner</Trans>
                        </ActionButton>
                    </div>}
                    <div className="col-12 mt-2 text-center">
                        <DecodedDataBox details={[action]} counter={false}/>
                    </div>
                    <div className='col-12 text-center d-grid gap-2 my-2'>
                        <ActionButton disabled={count < 50} onClick={handleAddAction}>
                            <Trans>Add action</Trans>
                        </ActionButton>
                    </div>
                </div>
            </ThemedContainer>
        </Modal>
    )
}