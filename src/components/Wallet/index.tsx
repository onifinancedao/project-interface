import { useWeb3React } from "@web3-react/core"
import ConnectWalletButton from "../ConnectWalletButton"
import WalletInfoButton from "../WalletInfoButton"

export default function Wallet() {
    const { chainId, account } = useWeb3React()
    if(chainId && account){
        return(
            <WalletInfoButton />
        )
    }else{
        return(
            <ConnectWalletButton />
        )
    }
}