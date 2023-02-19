import { Trans } from "@lingui/macro";

import { useDarkModeManager, useReducedVerticalMenuManager, useUserTheme } from "../../state/user/hooks";
import { useIsMobile } from "../../hooks/useIsMobile";

import Wallet from "../Wallet";
import ThemeButton from "../ThemeButton";

import Ofp_Icon from "../../assets/svg/ofp-icon.svg"
import "./index.css"
import { Menu } from "react-feather";

export default function NavBar() {
    const theme = useUserTheme()
    const isMobile = useIsMobile()
    const [darkMode,] = useDarkModeManager()
    const [isReduced, toggleVerticalMenu] = useReducedVerticalMenuManager()

    return (
        <nav className={"navbar sticky-top bg-"+theme} style={{height: "70px"}}>
            <div className="container-fluid">
                <div className="navbar-brand d-flex text-reset" >
                {!isMobile && <button className="btn d-flex justify-content-center" onClick={toggleVerticalMenu}><Menu color={darkMode?"#d2cfcf":"black"} size={30}/></button>}
                <a className="ms-1 text-reset d-flex align-items-center text-decoration-none" href="#/home">
                    <img src={Ofp_Icon} alt="" width="25" height="25" className="d-inline-block align-text-top"/>
                    {!isMobile && <h5 className="ms-1 mb-0 align-self-center"><Trans>Onifinance Project</Trans></h5>}
                </a>
                </div>
                <div className="d-flex" style={{alignItems: "center"}}>
                    <ThemeButton />
                    <Wallet />
                </div>
            </div>
        </nav>
    )
}