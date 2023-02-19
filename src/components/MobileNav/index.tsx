import { useIsMobile } from "../../hooks/useIsMobile"
import { useUserTheme } from "../../state/user/hooks"
import { IsActivePage } from "../../utils/IsActivePage"

import More_Horiz_Icon from "../../assets/svg/more-horiz-icon.svg"

import "./index.css"
import SettingsMenu from "../SettingsMenu"
import { Portal } from "../Portal"
import { useCloseModal, useModalIsOpen, useToggleSettingsMobileMenu } from "../../state/application/hooks"
import { ApplicationModal } from "../../state/application/reducer"
import { useRef } from "react"
import { useOnClickOutside } from "../../hooks/useOnClickOutside"
import { useCurrentStep } from "../../state/roadMap/hooks"
import { useEmergencyActive } from "../../state/emergency/hooks"
import JSBI from "jsbi"
import { Trans } from "@lingui/macro"

function Nav(){
  const theme = useUserTheme()
  const isOpen = useModalIsOpen(ApplicationModal.SETTINGS_MOBILE)
  const ref = useRef<HTMLLIElement>(null)
  const closeModal = useCloseModal(ApplicationModal.SETTINGS_MOBILE)
  const settingsRef = useRef<HTMLLIElement>(null)
  useOnClickOutside(ref, isOpen ? closeModal : undefined, [settingsRef])
  const toggleSettingsMobileMenu = useToggleSettingsMobileMenu()
  const currentStep = useCurrentStep()
  const emergencyActive = useEmergencyActive()
  return(
    <ul className={"mobile-nav nav justify-content-center align-content-center " + theme} style={{height:"60px"}}>
      { !emergencyActive && currentStep && JSBI.GE(currentStep,JSBI.BigInt(0)) && JSBI.LT(currentStep, JSBI.BigInt(2)) &&
        <li className={"d-flex align-items-center nav-item "+theme+IsActivePage("mint")}>
          <a className="nav-link" href="#/mint"><Trans>Mint</Trans></a>
        </li>
      } 
      { !emergencyActive && currentStep && JSBI.GE(currentStep,JSBI.BigInt(2)) && JSBI.LT(currentStep, JSBI.BigInt(12)) &&
        <li className={"d-flex align-items-center nav-item "+theme+IsActivePage("raffle")}>
          <a className="nav-link" href="#/raffle"><Trans>Raffle</Trans></a>
        </li>
      }
      { !emergencyActive && currentStep && JSBI.GE(currentStep,JSBI.BigInt(12)) &&
        <li className={"d-flex align-items-center nav-item "+theme+IsActivePage("exchange")}>
          <a className="nav-link" href="#/exchange"><Trans>Exchange</Trans></a>
        </li>
      }
      { emergencyActive &&
        <li className={"d-flex align-items-center nav-item "+theme+IsActivePage("burn")}>
          <a className="nav-link" href="#/burn"><Trans>Burn</Trans></a>
        </li>
      }
        <li className={"d-flex align-items-center nav-item "+theme+IsActivePage("roadmap")}>
          <a className="nav-link" href="#/roadmap"><Trans>Roadmap</Trans></a>
        </li>
        <li className={"d-flex align-items-center nav-item "+theme} onClick={toggleSettingsMobileMenu} ref={ref}>
          <img className={"mobile-nav-icon "+theme} alt="" src={More_Horiz_Icon} />
        </li>
        <Portal>
            <span ref={settingsRef}>
              <SettingsMenu mobile={true} />
            </span>
        </Portal>
      </ul>
  )
}
export default function MobileNav() {
  const isMobile = useIsMobile()
  
  if(isMobile){
    return (
      <Nav/>
    )
  }else{
    return(
      <div></div>
    )
  }
}