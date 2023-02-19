import { Trans } from "@lingui/macro"
import { getChainInfo } from "../../constants/chainInfo"
import { SupportedChainId } from "../../constants/chains"

export default function FailedNetworkSwitchPopup({ chainId }: { chainId: SupportedChainId }) {
    const chainInfo = getChainInfo(chainId)
    
  
    return (
        <div>
            <Trans>
              Failed to switch networks from the Onifinance Interface. In order to use Onifinance on {chainInfo.label}, you must
              change the network in your wallet.
            </Trans>
        </div>
    )
  }