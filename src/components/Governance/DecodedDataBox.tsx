import { useWeb3React } from "@web3-react/core"
import JSBI from "jsbi"
import { CurrencyAmount } from "../../sdk-core"
import { FOUR_BYTES_DIR, ProposalDetail } from "../../state/governance/hooks"
import { MAINNET_INFO } from "../../constants/chainInfo"
import { BIG_INT_ZERO } from "../../constants/misc"
import { UTILITY_TOKEN } from "../../constants/tokens"
import { decodeData, linkIfAddress } from "../../pages/Governance"


function DetailItem({detail, index, counter}:{detail: ProposalDetail, index: number, counter: boolean}){
    const {chainId} = useWeb3React()
    let signature = ''
    
  if (detail.functionSig === '') {
    const fourbyte = detail.callData.slice(0, 10)
    const sig = FOUR_BYTES_DIR[fourbyte] ?? 'UNKNOWN()'
    signature = sig
    if (!sig) throw new Error('Missing four byte sig')
     
    }else{
      signature = detail.functionSig
    }
    const {decodedData} = decodeData(signature, detail.callData)
    
    return(
        <div className="my-3" style={{wordBreak: 'break-all'}} key={index}>
            { counter ? index + 1 + ":" : "" } {linkIfAddress(detail.target, chainId)}.{signature.replace(/\(.*\)/g, "")}(
                {decodedData.split(',').map((content, index) => {
                    return (
                        <span key={index}>
                            {linkIfAddress(content, chainId)}
                            {decodedData.split(',').length - 1 === index ? '' : ', '}
                        </span>
                    )
                })}
            )
            {JSBI.GT(detail.value, BIG_INT_ZERO) && <span>.value({CurrencyAmount.fromRawAmount(UTILITY_TOKEN, detail.value).toExact()}) {MAINNET_INFO.nativeCurrency.symbol}</span>}
            
        </div>
    )
}
export default function DecodedDataBox({details, counter = true}:{details: ProposalDetail[], counter?: boolean | undefined}){
    
    return(
        <>
            {  details?.map((detail, index) => {
                return (
                    <DetailItem detail={detail} index={index} counter={counter} key={index}/>
                )
            })}
        </>
    )
}