import { Trans } from "@lingui/macro";
import { isAddress } from "ethers/lib/utils";
import JSBI from "jsbi";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

import { USD_TOKEN, UTILITY_TOKEN } from "../../constants/tokens";
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

export default function TransferOrApproveModal({addProposalDetail}:{addProposalDetail:(proposalDetail: ProposalDetail) => void}){
    const isOpen = useModalIsOpen(ApplicationModal.PROPOSAL_ACTION_TRANSFER_APPROVE)
    const onDismiss = useCloseModal(ApplicationModal.PROPOSAL_ACTION_TRANSFER_APPROVE)
    
    const [functionToExecute, setFunctionToExecute] = useState('transfer(address,uint256)')
    const [encodedCallData, setEncodedCallData] = useState('')
    const [token, setToken] = useState(USD_TOKEN.address)
    const [to, setTo] = useState('')
    const [amount, setAmount] = useState('0')
    const [validData, setValidData] = useState(false)

    useEffect(() => {
        const {encodedData, error} = encodeData(functionToExecute, [to,amount].toString())
        if(!error){
            setEncodedCallData(encodedData)
        }
        setValidData(!error)
    }, [functionToExecute, to, amount])
    
    const tokenDiv = useRef<HTMLDivElement>(null);

    const handlefunctionSigSelect = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
          const input = event.target.value
          const withoutSpaces = input.replace(/\s+/g, '')
            setFunctionToExecute(withoutSpaces)
        },
        [setFunctionToExecute]
    )
    
    const handleTokenSelect = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
          const input = event.target.value
          const withoutSpaces = input.replace(/\s+/g, '')
          switch (withoutSpaces) {
            case '0':
                setToken(USD_TOKEN.address)
                tokenDiv.current?.classList.add('d-none')
                break;
            case '1':
                setToken(UTILITY_TOKEN.address)
                tokenDiv.current?.classList.add('d-none')
                break;
            case '2':
                setToken('')
                tokenDiv.current?.classList.remove('d-none')
                break;
            default:
                break;
          }
        },
        [setToken]
    )

    const handleTokenInput = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
          const input = event.target.value
          const withoutSpaces = input.replace(/\s+/g, '')
          if(withoutSpaces === ''){
            event.target.classList.remove('is-invalid')
            event.target.classList.remove('is-valid')
          }else if(isAddress(withoutSpaces)){
            setToken(withoutSpaces)
            event.target.classList.remove('is-invalid')
            event.target.classList.add('is-valid')
          }else{
            event.target.classList.remove('is-valid')
            event.target.classList.add('is-invalid')
          }
        },
        [setToken]
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

    const handleAmountInput = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const input = event.target.value
            const withoutSpaces = input.replace(/\s+/g, '')
            if(isNumber(withoutSpaces)){
              if(Number(withoutSpaces) >= 0){
                  setAmount(withoutSpaces.replace(/\./g, ''))
                  event.target.value = withoutSpaces.replace(/\./g, '')
              }else{
                  setAmount('0')
                  event.target.value = ''
              }
            }else{
                setAmount('0')
              event.target.value = ''
            }
          },
        [setAmount]
    )
    
    const wrapOnDismiss = () => {
        setFunctionToExecute('transfer(address,uint256)')
        setToken(USD_TOKEN.address)
        setTo('')
        setAmount('0')
        onDismiss()
    }
    const handleAddAction = () =>{
        const action:ProposalDetail = {
            target: token,
            functionSig: functionToExecute,
            callData: encodedCallData,
            value: JSBI.BigInt(0),
        }
        addProposalDetail(action)
        wrapOnDismiss()
    }
    const theme = useUserTheme()
    const isValidData = Boolean(isAddress(token) && isAddress(to) && validData)
    return(
        <Modal isOpen={isOpen} scrollOverlay={true} onDismiss={wrapOnDismiss} maxHeight={90}>
            <ThemedContainer>
                <div className='row'>
                    <div className='col-9 mb-2'>
                        <span><Trans>Transfer or Approve</Trans></span>
                    </div>
                    <div className='col-3 mb-2 d-flex justify-content-end'>
                        <CloseButton onClick={wrapOnDismiss} />
                    </div>
                    <div className="col-12">
                        <div className="form-floating">
                            <select onChange={handlefunctionSigSelect} id="action" className={"form-select " + theme } defaultValue="0" aria-label="Action select">
                                <option value="transfer(address,uint256)"><Trans>Transfer token</Trans></option>
                                <option value="approve(address,uint256)"><Trans>Approve token</Trans></option>
                            </select>
                            <label  htmlFor="action"><Trans>Action</Trans></label>
                        </div>
                    </div>
                    <div className="col-12 mt-2">
                        <div className="form-floating">
                            <input onChange={handleToInput} type="text" name="" id="to" autoComplete="off" className={"form-control " + theme}/>
                            <label htmlFor="to"><Trans>To</Trans></label>
                        </div>
                    </div>
                    <div className="col-12 mt-2">
                        <div className="form-floating">
                            <select onChange={handleTokenSelect} id="token" className={"form-select " + theme} defaultValue={0}
                             aria-label="Token select">
                                <option value="0">USDC</option>
                                <option value="1">OFI</option>
                                <option value="2"><Trans>Customized</Trans></option>
                            </select>
                            <label htmlFor="token"><Trans>Token</Trans></label>
                        </div>
                    </div> 
                    <div className="col-12 mt-2 d-none" ref={tokenDiv}>
                        <div className="form-floating">
                            <input onChange={handleTokenInput} type="text" name="" id="tokenAddress" autoComplete="off" className={"form-control " + theme }/>
                            <label htmlFor="tokenAddress"><Trans>Token address</Trans></label>
                        </div>
                    </div>
                    <div className="col-12 mt-2">
                        <div className="form-floating">
                            <input onChange={handleAmountInput} type="text" name="" id="tokenAmount" autoComplete="off" className={"form-control " + theme }/>
                            <label htmlFor="tokenAmount"><Trans>Raw amount</Trans></label>
                        </div>
                    </div>
                    <div className="col-12 mt-2 text-center">
                        <DecodedDataBox details={[{target: token,functionSig: functionToExecute,callData: encodedCallData,value: JSBI.BigInt(0)}]} counter={false}/>
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