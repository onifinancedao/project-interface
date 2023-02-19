import { Trans } from "@lingui/macro";

import { useToggleConnectWalletModal } from "../../state/application/hooks";
import ConnectWalletModal from "../ConnectWalletModal";

export default function ConnectWalletButton() {
    const toggleConnectWalletModal = useToggleConnectWalletModal()
    return(
        <><ConnectWalletModal />
        <button onClick={toggleConnectWalletModal} className="btn btn-primary rounded-pill ms-1 me-1">
            <Trans>Connect Wallet</Trans>
        </button>
        </>
    )
}