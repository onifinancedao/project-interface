import { Trans } from "@lingui/macro";
import { useWeb3React } from "@web3-react/core";
import { SettingsMenuState } from ".";
import { useActiveLocale } from "../../hooks/useActiveLocale";
import { useDarkModeManager,  useUserIdenticon, useUserTheme } from "../../state/user/hooks";
import Chevron_Right from "../../assets/svg/chevron-right-icon.svg"
import Governance_Icon from "../../assets/svg/governor-icon.svg"
import Twitter_Icon from "../../assets/svg/twitter-icon.svg"
import Github_Icon from "../../assets/svg/github-icon.svg"
import Sun_Icon from "../../assets/svg/sun-icon.svg"
import Moon_Icon from "../../assets/svg/moon-icon.svg"
import { useCloseModal } from "../../state/application/hooks";
import { ApplicationModal } from "../../state/application/reducer";
import "./index.css"
import { useIsMobile } from "../../hooks/useIsMobile";
import { useDev } from "../../state/dev/hooks";
import { Code, Gift, HelpCircle, Terminal } from "react-feather";
import JSBI from "jsbi";
import { useCurrentStep } from "../../state/roadMap/hooks";
export default function SettingsDefaultMenu({ setSettingsMenu }: { setSettingsMenu: (state: SettingsMenuState) => void }){
    const { account } = useWeb3React()
    const dev = useDev()
    const activeLocale = useActiveLocale()
    const ISO = activeLocale.split('-')[0].toUpperCase()
    const userIdenticon = useUserIdenticon()
    const theme = useUserTheme()
    const close = useCloseModal(ApplicationModal.SETTINGS)
    const isMobile = useIsMobile()
    const [darkMode, setDarkMode] = useDarkModeManager()
    const currentStep = useCurrentStep()

    return(
        <div className="container">
            {isMobile &&
            <div className={"row settings-menu-bottom-border " + theme}>
                {   currentStep && JSBI.GE(currentStep,JSBI.BigInt(2)) &&
                    <a 
                        className={"col-12 my-1 py-2 text-decoration-none text-reset settings-menu-item " + theme}
                        onClick={()=>{close()}}
                        href="#/raffle"
                    >
                        <Gift className="me-1" color={darkMode?"#d2cfcf":"black"} size={24}/>
                        <Trans>Raffle</Trans>
                    </a>
                }
                <a 
                    className={"col-12 my-1 py-2 text-decoration-none text-reset settings-menu-item " + theme}
                    onClick={()=>{close()}}
                    href="#/governance"
                >
                    <img className={"me-1 vertical-nav-icon "+theme} alt="" src={Governance_Icon} />
                    <Trans>Governance</Trans>
                </a>
                
                {account && dev && account === dev  &&
                <a 
                className={"col-12 my-1 py-2 text-decoration-none text-reset settings-menu-item " + theme}
                onClick={()=>{close()}}
                href="#/dev"
                >
                    <Terminal color={darkMode?"#d2cfcf":"black"} className={'me-1'} size={24}/>
                    <Trans>Dev</Trans>
                </a>
                }
                <div className={"col-12 my-1 py-2 settings-menu-item " + theme}>
                    <a onClick={()=>{close()}} 
                    className="text-decoration-none text-reset d-flex" href="#/faq">
                        <HelpCircle color={darkMode?"#d2cfcf":"black"} className={'me-1'} size={24}/>
                        <Trans>FAQs</Trans>
                    </a>
                </div>
                <a 
                    className={"col-12 my-1 py-2 text-decoration-none text-reset settings-menu-item " + theme}
                    onClick={()=>{close()}} href="#/team">
                    <Code color={darkMode?"#d2cfcf":"black"} className={'me-1'} size={24}/>
                    <Trans>Dev Team</Trans>
                </a>
            </div>
            }
            <div className={"row " + (isMobile?"settings-menu-bottom-border " + theme : "")}>
                <div 
                    className={"col-12 my-1 py-2 settings-menu-item " + theme} 
                    onClick={() => setSettingsMenu(SettingsMenuState.LANGUAGE)}
                >
                    <div className="row" >
                        <div className="col-6">
                            <Trans>Language</Trans>
                        </div>
                        <div className="col-6 d-flex justify-content-end">
                            <span>{ISO}</span>
                            <img className={"settings-menu-icon "+theme} src={Chevron_Right} alt="" />
                        </div>
                    </div>
                </div>
                <div 
                    className={"col-12 my-1 py-2 settings-menu-item " + theme}
                    onClick={() => setSettingsMenu(SettingsMenuState.IDENT_ICON)}
                >
                    <div className="row">
                        <div className="col-6">
                            <Trans>Identicon</Trans>
                        </div>
                        
                        <div className="col-6 d-flex justify-content-end">
                            <span className="">{userIdenticon}</span>
                            <img className={"settings-menu-icon "+theme} src={Chevron_Right} alt="" />
                        </div>
                    </div>
                </div>
                <div 
                    className={"col-12 my-1 py-2 settings-menu-item " + theme}
                    onClick={() => setDarkMode(!darkMode)}
                >
                    <div className="row">
                        <div className="col-6">
                        {darkMode? <Trans>Light theme</Trans>:<Trans>Dark theme</Trans>}
                        </div>
                        
                        <div className="col-6 d-flex justify-content-end">
                            <img className={"settings-menu-icon "+theme} src={darkMode?Sun_Icon:Moon_Icon} alt="" />
                        </div>
                    </div>
                </div>
            </div>
            {isMobile &&
            <div className="row">
                <a  
                    className={"col-12 my-1 py-2 text-decoration-none text-reset settings-menu-item " + theme}
                    onClick={()=>{close()}}
                    href="https://twitter.com/OnifinanceDao" target='_blank' rel='noopener noreferrer'
                >
                    <img className="me-1 vertical-nav-icon" alt="" src={Twitter_Icon} />
                    Twitter
                </a>
                
                <a
                    className={"col-12 my-1 py-2 text-decoration-none text-reset settings-menu-item " + theme}
                    onClick={()=>{close()}}
                    href="https://github.com/OnifinanceDao" target='_blank' rel='noopener noreferrer'
                >
                    <img className={"me-1 vertical-nav-icon "+theme} alt="" src={Github_Icon} />
                    Github
                </a>
            </div>
            }
        </div>
    )
}