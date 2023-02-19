import { Trans } from "@lingui/macro";
import { isAddress } from "@ethersproject/address";
import JSBI from "jsbi";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

import { BIG_INT_ZERO } from "../../constants/misc";
import { encodeData } from "../../pages/Governance";
import { useCloseModal, useModalIsOpen } from "../../state/application/hooks";
import { ApplicationModal } from "../../state/application/reducer";
import { ProposalDetail } from "../../state/governance/hooks";
import { useUserTheme } from "../../state/user/hooks";
import { isNumber } from "../../utils";
import ActionButton from "../ActionButton";
import CloseButton from "../CloseButton";
import Modal from "../Modal";
import ThemedContainer from "../ThemedContainer";
import DecodedDataBox from "./DecodedDataBox";

export default function CustomActionModal({addProposalDetail}:{addProposalDetail:(proposalDetail: ProposalDetail) => void}){
    const isOpen = useModalIsOpen(ApplicationModal.PROPOSAL_ACTION_CUSTOM)
    const onDismiss = useCloseModal(ApplicationModal.PROPOSAL_ACTION_CUSTOM)
    
    const [target, setTarget] = useState('')
    const [functionToExecute, setFunctionToExecute] = useState('')
    const [callData, setCallData] = useState('')
    const [encodedCallData, setEncodedCallData] = useState('')
    const [value, setValue] = useState(BIG_INT_ZERO)
    const [validData, setValidData] = useState(false)
    const [useRawCalldata, setUseRawCalldata] = useState(false)
    useEffect(() => {
        const {encodedData, error} = encodeData(functionToExecute, callData)
        if(!error){
            setEncodedCallData(encodedData)
        }else{
            setEncodedCallData('')
        }
        setValidData(!error)
    }, [functionToExecute, callData])

    const handleTargetInput = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
          const input = event.target.value
          const withoutSpaces = input.replace(/\s+/g, '')
          setTarget(withoutSpaces)
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
        [setTarget]
    )

    const handleFunctionInput = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
          const input = event.target.value
          const withoutSpaces = input.replace(/\s+/g, '')
          let regex = /^[a-zA-Z0-9]*\(.*\)/mg;
          if(withoutSpaces === ''){
            event.target.classList.remove('is-invalid')
            event.target.classList.remove('is-valid')
          }else if(regex.test(withoutSpaces)){
            event.target.classList.remove('is-invalid')
            event.target.classList.add('is-valid')
          }else{
            event.target.classList.remove('is-valid')
            event.target.classList.add('is-invalid')
          }
          setFunctionToExecute(withoutSpaces)
        },
        [setFunctionToExecute]
    )

    const handleCalldataInput = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
          const input = event.target.value
          const withoutSpaces = input.replace(/\s+/g, '')
          setCallData(withoutSpaces)
        },
        [setCallData]
    )

    const handleRawCalldataInput = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
          const input = event.target.value
          const withoutSpaces = input.replace(/\s+/g, '')
          setEncodedCallData(withoutSpaces)
        },
        [setEncodedCallData]
    )

    const handleValueInput = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
          const input = event.target.value
          const withoutSpaces = input.replace(/\s+/g, '')
          if(isNumber(withoutSpaces)){
            if(Number(withoutSpaces) >= 0){
                setValue(JSBI.BigInt(withoutSpaces.replace(/\./g, '')))
                event.target.value = withoutSpaces.replace(/\./g, '')
            }else{
                setValue(BIG_INT_ZERO)
                event.target.value = ''
            }
          }else{
            setValue(BIG_INT_ZERO)
            event.target.value = ''
          }
        },
        [setValue]
    )
    const wrapOnDismiss = () => {
        setTarget('')
        setFunctionToExecute('')
        setCallData('')
        setEncodedCallData('')
        setValue(BIG_INT_ZERO)
        setValidData(false)
        onDismiss()
    }

    const handleAddAction = () => {
        const action:ProposalDetail = {
            target: target,
            functionSig: functionToExecute,
            callData: encodedCallData,
            value: value,
        }
        addProposalDetail(action)
        wrapOnDismiss()
    }
    
    const theme = useUserTheme()
    const isValidData = Boolean(isAddress(target) && ((functionToExecute !== '' && validData) || (useRawCalldata && encodedCallData !=='' && encodedCallData !== '0x')))
    return(
        <Modal isOpen={isOpen} scrollOverlay={true} onDismiss={wrapOnDismiss} maxHeight={80}>
            <ThemedContainer maxHeight="80vh">
                <div className='row'>
                    <div className='col-9 mb-2'>
                        <span><Trans>Custom Action</Trans></span>
                    </div>
                    <div className='col-3 mb-2 d-flex justify-content-end'>
                        <CloseButton onClick={wrapOnDismiss} />
                    </div>
                    <div className="col-12 mt-2">
                        <div className="form-floating">
                            <input onChange={handleTargetInput} type="text" name="" id="target" autoComplete="off" className={"form-control " + theme}/>
                            <label htmlFor="target"><Trans>Target</Trans></label>
                        </div>
                    </div>
                    <div className="col-12 mt-2">
                        <div className="form-check form-switch">
                            <input onChange={()=>{setUseRawCalldata(!useRawCalldata);setFunctionToExecute('');setCallData('');setEncodedCallData('')}} checked={useRawCalldata} className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"/>
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault"><Trans>Use raw calldata</Trans></label>
                        </div>
                    </div>
                    { !useRawCalldata && 
                    <div className="col-12 mt-2">
                        <div className="text-break my-2">
                            <small><Trans>Function with input data types</Trans></small>
                            <a className="ms-1" data-bs-toggle="collapse" href="#collapseFunctionExample1" role="button" aria-expanded="false" aria-controls="collapseFunctionExample1">
                                <small><Trans>example#1</Trans></small>
                            </a>
                            <a className="ms-1" data-bs-toggle="collapse" href="#collapseFunctionExample2" role="button" aria-expanded="false" aria-controls="collapseFunctionExample2">
                                <small><Trans>example#2</Trans></small>
                            </a>
                            <div className="collapse" id="collapseFunctionExample1">
                                <small>transfer(address,uint256)</small>
                            </div>
                            <div className="collapse" id="collapseFunctionExample2">
                                <small>communityRaffle(tuple(uint,address,string,string)[])</small>
                            </div>
                        </div>
                        <div className="form-floating">
                            <input onChange={handleFunctionInput} type="text" name="" id="function" autoComplete="off" className={"form-control " + theme}/>
                            <label htmlFor="function"><Trans>Function</Trans></label>
                        </div>
                    </div>
                    }
                    { !useRawCalldata && 
                    <div className="col-12 mt-2">
                        <div className="text-break my-2"><small><Trans>Call data</Trans></small>
                            <a className="ms-1" data-bs-toggle="collapse" href="#collapseCalldataExample1" role="button" aria-expanded="false" aria-controls="collapseCalldataExample1">
                                <small><Trans>example#1</Trans></small>
                            </a>
                            <a className="ms-1" data-bs-toggle="collapse" href="#collapseCalldataExample2" role="button" aria-expanded="false" aria-controls="collapseCalldataExample2">
                                <small><Trans>example#2</Trans></small>
                            </a>
                            <div className="collapse" id="collapseCalldataExample1">
                                <small>0xA0753BfD07b6B0cf496a74136f63a02da4F95e1A,1000000000000000000</small>
                            </div>
                            <div className="collapse" id="collapseCalldataExample2">
                                <small>["0xA0753BfD07b6B0cf496a74136f63a02da4F95e1A", "1000000000000000000"]</small>
                            </div>
                        </div>
                        <div className="form-floating">
                            <input onChange={handleCalldataInput} type="text" name="" id="calldata" autoComplete="off" className={"form-control " + theme}/>
                            <label htmlFor="calldata"><Trans>Call Data</Trans></label>
                        </div>
                    </div>
                    }
                    { useRawCalldata && 
                    <div className="col-12 mt-2">
                        <div className="text-break my-2"><small><Trans>Raw call data</Trans></small>
                            <a className="ms-1" data-bs-toggle="collapse" href="#collapseRawCalldataExample" role="button" aria-expanded="false" aria-controls="collapseRawCalldataExample">
                                <small><Trans>example</Trans></small>
                            </a>
                            <div className="collapse" id="collapseRawCalldataExample">
                                <small>0xa9059cbb000000000000000000000000a0753bfd07b6b0cf496a74136f63a02da4f95e1a0000000000000000000000000000000000000000000000000de0b6b3a7640000</small>
                            </div>
                        </div>
                        <div className="form-floating">
                            <input onChange={handleRawCalldataInput} type="text" name="" id="rawcalldata" autoComplete="off" className={"form-control " + theme}/>
                            <label htmlFor="calldata"><Trans>Raw call data</Trans></label>
                        </div>
                    </div>
                    }
                    <div className="col-12 mt-2">
                        <div className="form-floating">
                            <input onChange={handleValueInput} type="text" name="" id="value" autoComplete="off" className={"form-control " + theme}/>
                            <label htmlFor="value"><Trans>Raw Value</Trans></label>
                        </div>
                    </div>
                    <div className="col-12 mt-2 text-center">
                        <DecodedDataBox details={[{target, functionSig:functionToExecute, callData:encodedCallData, value}]} counter={false}/>
                    </div>
                    <div className='col-12 text-center d-grid gap-2 my-2'>
                        <ActionButton disabled={!isValidData} onClick={handleAddAction}>
                            <Trans>Add action</Trans>
                        </ActionButton>
                    </div>
                </div>
            </ThemedContainer>
        </Modal>
    )
}