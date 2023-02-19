import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { Trans } from "@lingui/macro";

import { WalletInfoMenuState } from ".";

import { useCurrencyBalanceString, useTokenBalances } from "../../lib/hooks/useCurrencyBalance"
import useCopyClipboard from "../../hooks/useCopyClipboard"
import { useDarkModeManager, useUserLocale, useUserTheme } from "../../state/user/hooks";
import { useAppDispatch } from "../../state/hooks";

import IdentIcon from "../IdentIcon"

import { updateSelectedWallet } from "../../state/user/reducer";

import { getConnection, getConnectionName, getIsMetaMask } from "../../connection/utils"
import { shortenAddress } from "../../utils"
import { ExplorerDataType, getExplorerLink } from "../../utils/getExplorerLink"

import { MAINNET_INFO } from "../../constants/chainInfo"
import { PROJECT_TOKEN, USD_TOKEN, UTILITY_TOKEN } from "../../constants/tokens"

import Copy_Icon from "../../assets/svg/copy-icon.svg"
import Check_Icon from "../../assets/svg/check-icon.svg"
import Explore_Icon from "../../assets/svg/explore-icon.svg"
import Disconnect_Icon from "../../assets/svg/disconnect-icon.svg"
import Chevron_Right from "../../assets/svg/chevron-right-icon.svg"
import Metamask_Icon from "../../assets/images/metamask.png"
import WalletConnect_Icon from "../../assets/svg/walletConnectIcon.svg"
import { HelpCircle } from "react-feather";

export default function WalletInfoDefault({ setMenu }: { setMenu: (state: WalletInfoMenuState) => void }){
    const theme = useUserTheme()
    const locale = useUserLocale()
    const [darkMode, ] = useDarkModeManager()
    
    const { chainId, account, connector } = useWeb3React()
    const walletName = getConnectionName(getConnection(connector).type, getIsMetaMask())
    
    
    
    const dispatch = useAppDispatch()
    const balanceString = useCurrencyBalanceString(account ?? '')
    const tokensBalance = useTokenBalances(account ?? '', [USD_TOKEN,PROJECT_TOKEN,UTILITY_TOKEN])
    
    const [isCopied, setCopied] = useCopyClipboard()
  
    const copy = useCallback(() => {
      setCopied(account || '')
    }, [account, setCopied])
    const disconnect = useCallback(() => {
      if (connector && connector.deactivate) {
        connector.deactivate()
      }
      connector.resetState()
      dispatch(updateSelectedWallet({ wallet: undefined }))
    }, [connector, dispatch])
    return(
        <div className="container">
                  <div className="row justify-content-between">
                    <div className="col-12 d-flex align-items-center justify-content-center mb-3">
                      <span><Trans>Connected with {walletName}</Trans></span>
                      {walletName === "MetaMask" && <img className="ms-2" src={Metamask_Icon} height="25px" alt="" />}
                      {walletName === "WalletConnect" && <img className="ms-2" src={WalletConnect_Icon} height="25px" alt="" />}
                      {walletName === "Injected" && <HelpCircle className="ms-2" color={darkMode?"#d2cfcf":"black"} size={25}/>}
                    </div>
                    <div className="col-6 d-flex align-items-center justify-content-start">
                      <IdentIcon address={account??''}/>
                      <p className="ms-2 mb-0 fw-semibold">{ shortenAddress(account??'', 2, 4) }</p>
                    </div>
                    <div className="col-6 d-flex align-items-center justify-content-end">
                      <button className={"mx-1 wallet-info-btn-action " + theme}  onClick={copy}>
                        <img src={isCopied?Check_Icon:Copy_Icon} alt="" />
                        <span style={{color: (darkMode?"rgb(181 181 181)":"rgb(13, 17, 28)")}}>
                          { isCopied ? <Trans>copied!</Trans> : <Trans>copy</Trans> }
                        </span>
                      </button>
                      <a 
                        className={"mx-1 d-flex wallet-info-btn-action " + theme} 
                        target='_blank' 
                        rel='noopener noreferrer'
                        href={getExplorerLink(chainId??1, account??'', ExplorerDataType.ADDRESS)}
                      >
                        <img className="m-auto" src={Explore_Icon} alt="" />
                        <span style={{color: (darkMode?"rgb(181 181 181)":"rgb(13, 17, 28)")}}>
                          <Trans>Explore</Trans>
                        </span>
                      </a>
                      <button className={"ms-1 wallet-info-btn-action " + theme} onClick={disconnect}>
                        <img src={Disconnect_Icon} alt="" />
                        <span style={{color: (darkMode?"rgb(181 181 181)":"rgb(13, 17, 28)")}}>
                          <Trans>Disconnect</Trans>
                        </span>
                      </button>
                    </div>
                    <div className="col-12 my-4 text-center">
                      <h3>{balanceString} {MAINNET_INFO.nativeCurrency.symbol}</h3>
                    </div>
                    <div 
                      className={"col-12 py-3 d-flex justify-content-between align-items-center border-top " + theme}
                    >
                      <div className="d-flex align-items-center">
                        <a 
                          className="d-flex align-items-center text-decoration-none text-reset" 
                          href={getExplorerLink(chainId??1, USD_TOKEN.address, ExplorerDataType.TOKEN)} 
                          target='_blank' 
                          rel='noopener noreferrer'
                        >
                          <img className="me-1" width="25px" src={USD_TOKEN.iconUrl} alt="" />
                          <h6 className="ms-1 mb-0 fw-semibold">{USD_TOKEN.symbol}</h6>
                          <img className={"ms-1 gift-icon " + theme} width="15px" src={Explore_Icon} alt="" />
                        </a>
                      </div>
                      <p className="mb-0">{Number(tokensBalance[USD_TOKEN.address]?.toExact()).toLocaleString(locale??"en-US")}</p>
                    </div>
                    <div 
                      className={"col-12 py-3 d-flex justify-content-between align-items-center " + theme}
                    >
                      <div className="d-flex align-items-center">
                        <a 
                          className="d-flex align-items-center text-decoration-none text-reset" 
                          href={getExplorerLink(chainId??1, PROJECT_TOKEN.address, ExplorerDataType.TOKEN)} 
                          target='_blank' 
                          rel='noopener noreferrer'
                        >
                          <img className="me-1" width="25px" src={PROJECT_TOKEN.iconUrl} alt="" />
                          <h6 className="ms-1 mb-0 fw-semibold">{PROJECT_TOKEN.symbol}</h6>
                          <img className={"ms-1 gift-icon " + theme} width="15px" src={Explore_Icon} alt="" />
                        </a>
                      </div>
                      <p className="mb-0">{Number(tokensBalance[PROJECT_TOKEN.address]?.toExact()).toLocaleString(locale??"en-US")}</p>
                    </div>
                    <div 
                      className={"col-12 py-3 d-flex justify-content-between align-items-center border-bottom " + theme}
                    >
                      <div className="d-flex align-items-center">
                        <a 
                          className="d-flex align-items-center text-decoration-none text-reset" 
                          href={getExplorerLink(chainId??1, UTILITY_TOKEN.address, ExplorerDataType.TOKEN)} 
                          target='_blank' 
                          rel='noopener noreferrer'
                          data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="<em>Tooltip</em> <u>with</u> <b>HTML</b>"
                        >
                          <img className="me-1" width="25px" src={UTILITY_TOKEN.iconUrl} alt="" />
                          <h6 className="ms-1 mb-0 fw-semibold">{UTILITY_TOKEN.symbol}</h6>
                          <img className={"ms-1 gift-icon " + theme} width="15px" src={Explore_Icon} alt="" />
                        </a>
                      </div>
                      <p className="mb-0">{Number(tokensBalance[UTILITY_TOKEN.address]?.toSignificant()).toLocaleString(locale??"en-US")}</p>
                    </div>
                    <div 
                      className={"col-12 mt-3 py-2 settings-menu-item " + theme} 
                      onClick={() => setMenu(WalletInfoMenuState.TRANSACTIONS)}
                    >
                    <div className="row" >
                        <div className="col-6">
                            <Trans>Transactions</Trans>
                        </div>
                        <div className="col-6 d-flex justify-content-end">
                            <img className={"settings-menu-icon "+theme} src={Chevron_Right} alt="" />
                        </div>
                    </div>
                </div>
                  </div>
                </div>
    )
}