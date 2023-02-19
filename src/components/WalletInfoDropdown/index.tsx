import { useWeb3React } from "@web3-react/core"
import { useState } from "react"

import { useIsMobile } from "../../hooks/useIsMobile"
import { useModalIsOpen } from "../../state/application/hooks"
import { ApplicationModal } from "../../state/application/reducer"
import { useDarkModeManager } from "../../state/user/hooks"

import "./index.css"
import TransactionsMenu from "./TransactionsMenu"
import WalletInfoDefault from "./WalletInfoDefault"


export enum WalletInfoMenuState {
  DEFAULT = 'DEFAULT',
  TRANSACTIONS = 'TRANSACTIONS',
}

export default function WalletInfoDropdown(){
  const isMobile = useIsMobile()
  const isOpen = useModalIsOpen(ApplicationModal.WALLET_DROPDOWN)
  const { chainId, account } = useWeb3React()
  const [darkMode, ] = useDarkModeManager()
  const [menu, setMenu] = useState<WalletInfoMenuState>(WalletInfoMenuState.DEFAULT)
  
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
                    width: (isMobile?"100%":"337px"),
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
                    padding: "16px 10px",
                    maxHeight: "85vh",
                    overflowX: "hidden",
                    overflowY: "auto",
                  }
                }
              >
                {menu === WalletInfoMenuState.TRANSACTIONS && <TransactionsMenu onClose={() => setMenu(WalletInfoMenuState.DEFAULT)} />}
                {menu === WalletInfoMenuState.DEFAULT && <WalletInfoDefault setMenu={setMenu} />}
              </div>
            </div>
          )
        }
      </>
    )
}