import { useRef } from 'react'
import { t, Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import JSBI from 'jsbi'
import { Code, DollarSign, Gift, HelpCircle, Map, PlusCircle, Settings, Terminal } from 'react-feather'

import { useIsMobile } from "../../hooks/useIsMobile"
import { useClaimableBalance, useDarkModeManager, useReducedVerticalMenuManager, useUserTheme } from "../../state/user/hooks"
import { useCloseModal, useModalIsOpen, useToggleSettingsMenu, useToggleWithdrawClaimableBalanceModal } from '../../state/application/hooks'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'

import { useDev } from '../../state/dev/hooks'
import { useCurrentStep } from '../../state/roadMap/hooks'
import { useEmergencyActive } from '../../state/emergency/hooks'
import { ApplicationModal } from '../../state/application/reducer'

import { IsActivePage } from "../../utils/IsActivePage"

import { Portal } from '../Portal'
import SettingsMenu from '../SettingsMenu'

import Exchange_Icon from "../../assets/svg/claim-icon.svg"
import Burn_Icon from "../../assets/svg/burn-icon.svg"
import Governance_Icon from "../../assets/svg/governor-icon.svg"
import Twitter_Icon from "../../assets/svg/twitter-icon.svg"
import Github_Icon from "../../assets/svg/github-icon.svg"

import "./index.css"
import { BIG_INT_ZERO } from '../../constants/misc'

export default function VerticalNav() {
  const isMobile = useIsMobile()
  const theme = useUserTheme()
  const [darkMode,] = useDarkModeManager()
  const {account} = useWeb3React()
  const dev = useDev()
  const [isReduced, ] = useReducedVerticalMenuManager()
  const toggleSettingsMenu = useToggleSettingsMenu()
  const toggleWithdraw = useToggleWithdrawClaimableBalanceModal()

  const isOpen = useModalIsOpen(ApplicationModal.SETTINGS)
  const ref = useRef<HTMLLIElement>(null)
  const closeModal = useCloseModal(ApplicationModal.SETTINGS)
  const settingsRef = useRef<HTMLLIElement>(null)
  useOnClickOutside(ref, isOpen ? closeModal : undefined, [settingsRef])
  const currentStep = useCurrentStep()
  const emergencyActive = useEmergencyActive()
  const claimableBalance = useClaimableBalance()
    if(!isMobile){
      return (
        <div style={{maxHeight: "calc(100vh - 70px)"}} className={isReduced?'col-1 col-xl-1 col-lg-1 col-md-1 overflow-auto smooth-scroll position-sticky':'col-xl-2 col-lg-3 col-md-3 col-sm-4 overflow-auto smooth-scroll position-sticky'}>
          <ul className={"nav pt-2 pb-2 flex-column vertical-nav bottom-border "+theme}>
           
            { !emergencyActive && currentStep && JSBI.GE(currentStep,JSBI.BigInt(0)) && JSBI.LT(currentStep, JSBI.BigInt(2)) &&
              <li className={"nav-item mb-1 "+theme+IsActivePage("mint")} title={t`Mint`}>
              <a className={"nav-link " + (isReduced?'text-center  px-0':'text-truncate')} href="#/mint">
                <PlusCircle color={darkMode?"#d2cfcf":"black"} size={24}/>
                {!isReduced && <span className='ms-2'><Trans>Mint</Trans></span>}
                </a>
              </li>
            }
            { currentStep && JSBI.GE(currentStep,JSBI.BigInt(12)) && !emergencyActive &&
            <li className={"nav-item mb-1 "+theme+IsActivePage("exchange")}  title={t`Exchange`}>
              <a className={"nav-link " + (isReduced?'text-center  px-0':'text-truncate')} href="#/exchange">
                <img className={"vertical-nav-icon "+theme} alt="" src={Exchange_Icon} />
                {!isReduced && <span className='ms-2'><Trans>Exchange</Trans></span>}
                </a>
            </li>
            }
            { emergencyActive &&
            <li className={"nav-item mb-1 "+theme+IsActivePage("burn")}  title={t`Burn`}>
              <a className={"nav-link " + (isReduced?'text-center  px-0':'text-truncate')} href="#/burn">
                <img className={"vertical-nav-icon "+theme} alt="" src={Burn_Icon} />
                {!isReduced && <span className='ms-2'><Trans>Burn</Trans></span>}
                </a>
            </li>
            }
            { claimableBalance && JSBI.GT(claimableBalance, BIG_INT_ZERO) && !emergencyActive &&
              <li className={"nav-item mb-1 "+theme} onClick={toggleWithdraw} ref={ref}  title={t`Withdraw`}>
              <button style={{border: "none", backgroundColor: "transparent", width:"100%"}} className={"nav-link " + (isReduced?'px-0':'text-truncate text-start')}>
                <DollarSign color={darkMode?"#d2cfcf":"black"} size={24}/>
                {!isReduced && <span className='ms-2'><Trans>Withdraw</Trans></span>}
              </button>
            </li>
            }
            { currentStep && JSBI.GE(currentStep,JSBI.BigInt(2)) &&
            <li className={"nav-item mb-1 "+theme+IsActivePage("raffle")}  title={t`Raffle`}>
              <a className={"nav-link " + (isReduced?'text-center  px-0':'text-truncate')} href="#/raffle">
                <Gift color={darkMode?"#d2cfcf":"black"} size={24}/>
                {!isReduced && <span className='ms-2'><Trans>Raffle</Trans></span>}
              </a>
            </li>
            }
            <li className={"nav-item mb-1 "+theme+IsActivePage("roadmap")}  title={t`Roadmap`}>
              <a className={"nav-link " + (isReduced?'text-center  px-0':'text-truncate')} href="#/roadmap">
                <Map color={darkMode?"#d2cfcf":"black"} size={24}/>
                {!isReduced && <span className='ms-2'><Trans>Roadmap</Trans></span>}
              </a>
            </li>
            <li className={"nav-item mb-1 "+theme+IsActivePage("governance")}  title={t`Governance`}>
              <a className={"nav-link " + (isReduced?'text-center  px-0':'text-truncate')} href="#/governance">
                <img className={"vertical-nav-icon "+theme} alt="" src={Governance_Icon} />
                {!isReduced && <span className='ms-2'><Trans>Governance</Trans></span>}
              </a>
            </li>
            {account && dev && account === dev  && 
            <li className={"nav-item mb-1 "+theme+IsActivePage("dev")}  title={t`Dev`}>
              <a className={"nav-link " + (isReduced?'text-center  px-0':'text-truncate')} href="#/dev">
                <Terminal color={darkMode?"#d2cfcf":"black"} size={24}/>
                {!isReduced && <span className='ms-2'><Trans>Dev</Trans></span>}
              </a>
            </li>
            }
          </ul>

          <ul className={"nav pt-2 pb-2 flex-column vertical-nav bottom-border "+theme}>
            <li className={"nav-item mb-1 "+theme} onClick={toggleSettingsMenu} ref={ref}  title={t`Settings`}>
              <button style={{border: "none", backgroundColor: "transparent", width:"100%"}} className={"nav-link " + (isReduced?'px-0 ':'text-truncate text-start')}>
                <Settings color={darkMode?"#d2cfcf":"black"} size={24}/>
                {!isReduced && <span className='ms-2'><Trans>Settings</Trans></span>}
              </button>
            </li>
            <Portal>
              <span ref={settingsRef}>
                <SettingsMenu mobile={false} />
              </span>
            </Portal>
            <li className={"nav-item mb-1 "+theme+IsActivePage("faq")}  title={t`FAQs`}>
              <a className={"nav-link " + (isReduced?'text-center  px-0':'text-truncate')} href="#/faq">
                <HelpCircle color={darkMode?"#d2cfcf":"black"} size={24}/>
                {!isReduced && <span className='ms-2'><Trans>FAQs</Trans></span>}
              </a>
            </li>
            <li className={"nav-item mb-1 "+theme+IsActivePage("team")}  title={t`Dev Team`}>
              <a className={"nav-link " + (isReduced?'text-center  px-0':'text-truncate')} href="#/team">
                <Code color={darkMode?"#d2cfcf":"black"} size={24}/>
                {!isReduced && <span className='ms-2'><Trans>Dev Team</Trans></span>}
              </a>
            </li>
          </ul>
          <ul className={"nav pt-2 pb-2 flex-column vertical-nav "+theme}>
            <li className={"nav-item mb-1 "+theme}  title="Twitter">
              <a className={"nav-link " + (isReduced?'text-center  px-0':'text-truncate')} href="https://twitter.com/OnifinanceDao" target='_blank' rel='noopener noreferrer'>
                <img className="vertical-nav-icon" alt="" src={Twitter_Icon} />
                {!isReduced && <span className='ms-2'>Twitter</span>}
              </a>
            </li>
            <li className={"nav-item mb-1 "+theme} title="Github">
              <a className={"nav-link " + (isReduced?'text-center  px-0':'text-truncate')} href="https://github.com/OnifinanceDao" target='_blank' rel='noopener noreferrer'>
                <img className={"vertical-nav-icon "+theme} alt="" src={Github_Icon} />
                {!isReduced && <span className='ms-2'>Github</span>}
              </a>
            </li>
          </ul>
        </div>
      )
    } else {
        return (
            <></>
        )
    }
    
}