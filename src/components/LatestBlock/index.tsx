import { useWeb3React } from "@web3-react/core"
import ms from 'ms.macro'

import useBlockNumber from "../../lib/hooks/useBlockNumber"
import useMachineTimeMs from "../../hooks/useMachineTime"
import useCurrentBlockTimestamp from "../../hooks/useCurrentBlockTimestamp"
import { getChainInfo } from "../../constants/chainInfo"

import "./index.css"
import { ExplorerDataType, getExplorerLink } from "../../utils/getExplorerLink"
import { Trans } from '@lingui/macro'
import { useUserTheme } from "../../state/user/hooks"

import Alert_Triangle_Icon from "../../assets/svg/alert-triangle-icon.svg"


const DEFAULT_MS_BEFORE_WARNING = ms`1m`
const NETWORK_HEALTH_CHECK_MS = ms`40s`
function WarningAlert(){
  const theme = useUserTheme()
  
    return(
      <div className={"px-2 py-3 text-center network-alert-container " + theme}>
        <div className="row">
          <div className="col-12 d-flex justify-content-center align-items-center">
            <img className={"warning-icon " + theme} src={Alert_Triangle_Icon} alt="" />
            <h5 className="mb-0 ms-2"><Trans>Network warning</Trans></h5>
          </div>
          <div className="col-12">
            <p className="mb-0"><Trans>You may have lost your network connection.</Trans></p>
          </div>
        </div>
      </div>
    )
  
}
export default function LatestBlock() {
  
  const { chainId } = useWeb3React()
  const blockNumber = useBlockNumber()
  const machineTime = useMachineTimeMs(NETWORK_HEALTH_CHECK_MS)
  const blockTime = useCurrentBlockTimestamp()
  
  const waitMsBeforeWarning =
    (chainId ? getChainInfo(chainId)?.blockWaitMsBeforeWarning : DEFAULT_MS_BEFORE_WARNING) ?? DEFAULT_MS_BEFORE_WARNING
  
  const warning = Boolean(!!blockTime && machineTime - blockTime.mul(1000).toNumber() > waitMsBeforeWarning)

    return(<>
        { warning?
          <WarningAlert/>
          :""
        }
        <div className="my-4 d-flex align-items-center justify-content-end">
          
          {
            chainId && blockNumber?
              <a 
                href={getExplorerLink(chainId, blockNumber.toString(), ExplorerDataType.BLOCK)}
                target='_blank' 
                rel='noopener noreferrer'
                className={warning?"text-decoration-none text-warning fw-normal":"text-decoration-none text-success fw-normal"}
              >
              { blockNumber.toString() }
              </a>
            :''
          }
          <div className={warning?"bg-warning latest-block-icon mx-1":"bg-success latest-block-icon mx-1"}></div>
        </div>
      </>
    )
}