import { Trans } from "@lingui/macro";
import { useRef, useState } from "react";

import { useUserVisibleDisclaimerManager } from "../../state/user/hooks";
import ActionButton from "../ActionButton";

import Modal from "../Modal";
import ThemedContainer from "../ThemedContainer";

export default function DisclaimerModal() {
    
    const [visibleDisclaimer, setVisibleDisclaimer] = useUserVisibleDisclaimerManager();
    const closeDisclaimer = ()=>{
        setVisibleDisclaimer(false)
    }
    const [disabled, setDisabled] = useState(true)
    const checkBox = useRef<HTMLInputElement>(null);

    const check = () =>{
        if(checkBox.current){
            if(checkBox.current.checked){
                setDisabled(false)
            }else{
                setDisabled(true)
            }
        }
    }

    return (
        <Modal isOpen={visibleDisclaimer} onDismiss={()=>{}} minHeight={false} maxHeight={90}>
          <ThemedContainer>
          <div className='container p-3'>
            <div className='row'>
              <div className='col-12 mb-2'>
                <div className='row align-items-center'>
                  <div className='col-12 text-center'>
                    <h5 className='mb-0 fw-semibold'><Trans>Disclaimer</Trans></h5>
                  </div>
                </div>
              </div>
              <div className='col-12'>
                <div className='row m-2'>
                    <div className="col-12">
                        <p>
                            <Trans>Onifinance uses smart contracts for its operation and decision making, there is unaudited code and it may contain errors, DO NOT invest more than you are willing to lose.</Trans>
                        </p>
                    </div>
                    <div className="col-1">
                        <input className="form-check-input" onChange={()=>{check()}} ref={checkBox} type="checkbox"/>
                    </div>
                    <div className="col-11">
                        <small>
                            <Trans>I agree that I am acting at my own risk and I will NOT hold the developer legally responsible for any financial loss due to errors in the <a href="https://github.com/OnifinanceDao" target='_blank' rel='noopener noreferrer'><Trans>source code</Trans></a>.</Trans>
                        </small>
                    </div>
                    <div className="col-12 text-center mt-4">
                        <ActionButton disabled={disabled} onClick={closeDisclaimer}>
                          <Trans>Continue</Trans>
                        </ActionButton>
                    </div>
                </div>
              </div>
            </div>
          </div>
          </ThemedContainer>
        </Modal>
    )
}