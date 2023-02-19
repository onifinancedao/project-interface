import { useWeb3React } from "@web3-react/core"
import { useCloseModal, useModalIsOpen, useToggleModal, useToggleWalletInfoDropdown } from "../../state/application/hooks"
import { useUserTheme } from "../../state/user/hooks"
import { shortenAddress } from "../../utils"
import IdentIcon from "../IdentIcon"
import "./index.css"
import Expand_More_Icon from "../../assets/svg/expand-more-icon.svg"
import Expand_Less_Icon from "../../assets/svg/expand-less-icon.svg"
import { ApplicationModal } from "../../state/application/reducer"
import WalletInfoDropdown from "../WalletInfoDropdown"
import { useOnClickOutside } from "../../hooks/useOnClickOutside"
import { useRef } from "react"
import { Portal } from "../Portal"
import { getChainInfo } from "../../constants/chainInfo"
import { Activity } from "react-feather"
import { Trans } from "@lingui/macro"
import UnsupportedNetworkDropdown from "../UnsupportedNetworkDropdown"

export default function WalletInfoButton() {
  const { chainId, account } = useWeb3React()
  const theme = useUserTheme()
  const toggleWalletInfoDropdown = useToggleWalletInfoDropdown()
  const toggleNetworkDropdown = useToggleModal(ApplicationModal.NETWORK_ERROR)

  const isOpen = useModalIsOpen(ApplicationModal.WALLET_DROPDOWN)
  const isErrorOpen = useModalIsOpen(ApplicationModal.NETWORK_ERROR)

  const ref = useRef<HTMLDivElement>(null)
  const refE = useRef<HTMLDivElement>(null)

  const closeModal = useCloseModal(ApplicationModal.WALLET_DROPDOWN)
  const closeErrorModal = useCloseModal(ApplicationModal.NETWORK_ERROR)

  const mRef = useRef<HTMLDivElement>(null)
  const mERef = useRef<HTMLDivElement>(null)

  useOnClickOutside(ref, isOpen ? closeModal : undefined, [mRef])
  useOnClickOutside(refE, isErrorOpen ? closeErrorModal : undefined, [mERef])

  const info = chainId ? getChainInfo(chainId) : undefined
  
  if(info){
    return(
      <span ref={ref}>
        <div 
          className={"d-flex align-items-center px-2 wallet-info-button " + theme}
          onClick={()=>{toggleWalletInfoDropdown()}}
        >   
          { chainId && account && <IdentIcon address={account}/>}
          { chainId && account && <p className="mb-0 fw-normal ms-2">{ shortenAddress(account)}</p>}
          <img className={"expand-icon " + theme} src={isOpen?Expand_Less_Icon:Expand_More_Icon} alt="" />
        </div>
        <Portal>
          <span ref={mRef}>
            <WalletInfoDropdown />
          </span>
        </Portal>
      </span>
    )
  }else{
    return(
      <span ref={refE}>
        <div 
          style={{color:"#fff"}}
          className={"d-flex align-items-center px-2 unsupported-network-button"}
          onClick={()=>{toggleNetworkDropdown()}}
        >   
          <Trans>Unsupported</Trans>
          <Activity color="#fff" className="ms-1"/>
          <img className={"expand-icon"} style={{filter: "invert(1)"}} src={isErrorOpen?Expand_Less_Icon:Expand_More_Icon} alt="" />
        </div>
        <Portal>
          <span ref={mERef}>
            <UnsupportedNetworkDropdown />
          </span>
        </Portal>
      </span>
    )
  }
}