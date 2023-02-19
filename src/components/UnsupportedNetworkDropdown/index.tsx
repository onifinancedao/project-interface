import { Trans } from "@lingui/macro"
import { useWeb3React } from "@web3-react/core"
import { useCallback, useState } from "react"
import { DefaultChainId, SupportedChainId } from "../../constants/chains"

import { useIsMobile } from "../../hooks/useIsMobile"
import useSelectChain from "../../hooks/useSelectChain"
import { useCloseModal, useModalIsOpen } from "../../state/application/hooks"
import { ApplicationModal } from "../../state/application/reducer"
import { useDarkModeManager } from "../../state/user/hooks"
import ActionButton from "../ActionButton"

export default function UnsupportedNetworkDropdown(){
    
  const isMobile = useIsMobile()
  const isOpen = useModalIsOpen(ApplicationModal.NETWORK_ERROR)
  const closeModal = useCloseModal(ApplicationModal.NETWORK_ERROR)
  const { chainId, account } = useWeb3React()
  const [darkMode, ] = useDarkModeManager()
  const selectChain = useSelectChain()

  const [pending, setPending] = useState(false)

  const onClick = useCallback(
    async (targetChainId: SupportedChainId) => {
      setPending(true)
      await selectChain(targetChainId)
      setPending(false)
      closeModal()
    },
    [selectChain]
  )
  
    return (
      <>
        {
          isOpen && chainId && account && (
            <div 
              className="px-2"
              style={
                {
                  position: "fixed", 
                  top: "65px",
                  right: (isMobile?"auto":"20px"),
                  width: (isMobile?"100vw":"330px"),
                  zIndex: 1030
                }
              }
            >
              <div
                style={
                  {
                    borderRadius: "12px",
                    width: (isMobile?"100%":"320px"),
                    display: "flex",
                    flexDirection: "column",
                    fontSize: "16px",
                    top: "60px",
                    right: (isMobile?"0px":"70px"),
                    left:  (isMobile?"0px":"auto"),
                    backgroundColor: (darkMode?"rgb(18 18 18)":"rgb(255, 255, 255)"),
                    border: "1px solid",
                    borderColor: (darkMode?"rgb(42 42 42)":"rgb(210, 217, 238)"),
                    boxShadow: "rgb(51 53 72 / 4%) 8px 12px 20px, rgb(51 53 72 / 2%) 4px 6px 12px, rgb(51 53 72 / 4%) 4px 4px 8px",
                    padding: "16px 10px"
                  }
                }
              >
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center">
                            <span className="fs-5"><Trans>Unsupported network!</Trans></span>
                        </div>
                        <div className="col-12 my-2 text-center">
                            
                            <Trans>Onifinance is currently only available on the <a target="_blank" className="text-reset" href="https://polygon.technology/" rel="noopener noreferrer">Polygon Network</a>.</Trans>
                        </div>
                        <div className="col-12 mt-2">
                            <ActionButton disabled={pending} onClick={()=>{onClick(DefaultChainId)}}>
                                {!pending?
                                <Trans>Connect to polygon network</Trans>
                                :
                                <Trans>Connecting</Trans>
                                }
                            </ActionButton>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          )
        }
      </>
    )
}