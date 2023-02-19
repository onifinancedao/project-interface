import { useCallback, useEffect } from "react"
import { useRemovePopup } from "../../state/application/hooks"
import { PopupContent } from "../../state/application/reducer"
import FailedNetworkSwitchPopup from "./FailedNetworkSwitchPopup"
import TransactionPopup from "./TransactionPopup"

import CloseButton from "../CloseButton"
import ThemedContainer from "../ThemedContainer"

export default function PopupItem({
    removeAfterMs,
    content,
    popKey,
  }: {
    removeAfterMs: number | null
    content: PopupContent
    popKey: string
  }) {
    const removePopup = useRemovePopup()
    const removeThisPopup = useCallback(() => removePopup(popKey), [popKey, removePopup])
    useEffect(() => {
        if (removeAfterMs === null) return undefined

            const timeout = setTimeout(() => {
                removeThisPopup()
            }, removeAfterMs)

            return () => {
                clearTimeout(timeout)
            }
    }, [removeAfterMs, removeThisPopup])

    let popupContent
    if ('failedSwitchNetwork' in content) {
        popupContent = <FailedNetworkSwitchPopup chainId={content.failedSwitchNetwork} />
    }else{
      popupContent = <TransactionPopup hash={content.txn.hash} removeThisPopup={removeThisPopup}/>
    }

    return popupContent ? (
    
        <div className="my-1" style={{width: "max-content"}}>
          <ThemedContainer maxWidth="100%">
              {popupContent}
          </ThemedContainer>
        </div>
  ) : null
}