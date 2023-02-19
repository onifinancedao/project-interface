import { useActivePopups } from "../../state/application/hooks";
import PopupItem from "./PopupItem";
import "./index.css"
import ClaimableBalancePopup from "../ClaimableBalancePopup";
import { useWeb3React } from "@web3-react/core";
import { useClaimableBalance } from "../../state/user/hooks";
import JSBI from "jsbi";
import { BIG_INT_ZERO } from "../../constants/misc";
import { useEmergencyActive } from "../../state/emergency/hooks";

export default function Popups(){
    const activePopups = useActivePopups()
    const {account} = useWeb3React()
    const claimableBalance = useClaimableBalance()
    const emergencyActive = useEmergencyActive()
    return (
        <>
            {account && !emergencyActive && claimableBalance && JSBI.GT(claimableBalance, BIG_INT_ZERO) && <ClaimableBalancePopup/>}
            {
                activePopups.map((item) => (
                    <PopupItem key={item.key} content={item.content} popKey={item.key} removeAfterMs={item.removeAfterMs} />
                ))
            }
        </>
    )
}