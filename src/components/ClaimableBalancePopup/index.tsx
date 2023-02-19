import { Trans } from "@lingui/macro";
import { useState } from "react";
import { BIG_INT_ZERO } from "../../constants/misc";
import { USD_TOKEN } from "../../constants/tokens";
import { CurrencyAmount } from "../../sdk-core";
import { useToggleWithdrawClaimableBalanceModal } from "../../state/application/hooks";
import { useClaimableBalance, useUserLocale } from "../../state/user/hooks";
import CloseButton from "../CloseButton";
import ThemedContainer from "../ThemedContainer";

export default function ClaimableBalancePopup(){
    const claimableBalance = useClaimableBalance()
    const toggleWithdrawClaimableBalanceModal = useToggleWithdrawClaimableBalanceModal()
    const [view, setView] = useState(true)
    const locale = useUserLocale()
    if(view){
        return(
            <div className="justify-content-end my-1">
                <div>
                    <ThemedContainer>
                        <div className="row">
                            <div className="col-10 text-center"><Trans>{Number(CurrencyAmount.fromRawAmount(USD_TOKEN, claimableBalance || BIG_INT_ZERO).toExact()).toLocaleString(locale??"en-US")} {USD_TOKEN.symbol} available to <span style={{cursor:"pointer"}} onClick={()=>{setView(false);toggleWithdrawClaimableBalanceModal()}} className="ms-1 text-decoration-underline">withdraw</span></Trans></div>
                            <div className="col-2 align-items-center d-flex"><CloseButton onClick={()=>{setView(false)}} /></div>
                        </div>
                    </ThemedContainer>
                </div>
            </div>
        )
    }else{
        return(
            <div></div>
        )
    }
}