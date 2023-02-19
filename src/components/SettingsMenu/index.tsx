import { useState } from "react"
import { useIsMobile } from "../../hooks/useIsMobile"
import { useModalIsOpen } from "../../state/application/hooks"
import { ApplicationModal } from "../../state/application/reducer"
import { useDarkModeManager } from "../../state/user/hooks"
import IdentIconMenu from "./IdentIconMenu"
import LanguageMenu from "./LanguageMenu"
import SettingsDefaultMenu from "./SettingsDefaultMenu"
export enum SettingsMenuState {
    DEFAULT = 'DEFAULT',
    LANGUAGE = 'LANGUAGE',
    IDENT_ICON = 'IDENT_ICON',
}

export default function SettingsMenu({mobile}:{mobile:boolean}){
    const [darkMode, ] = useDarkModeManager()
    const isMobile = useIsMobile()
  
    const isOpen = useModalIsOpen(mobile?ApplicationModal.SETTINGS_MOBILE:ApplicationModal.SETTINGS)
    const [settingsMenu, setSettingsMenu] = useState<SettingsMenuState>(SettingsMenuState.DEFAULT)
    return (
      <>
        {
          isOpen && (
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
                {settingsMenu === SettingsMenuState.LANGUAGE && <LanguageMenu onClose={() => setSettingsMenu(SettingsMenuState.DEFAULT)} />}
                {settingsMenu === SettingsMenuState.IDENT_ICON && <IdentIconMenu onClose={() => setSettingsMenu(SettingsMenuState.DEFAULT)} />}
                {settingsMenu === SettingsMenuState.DEFAULT && <SettingsDefaultMenu setSettingsMenu={setSettingsMenu} />}
              </div>
            </div>
          )
        }
      </>
    )
}