import { useLayoutEffect, useMemo, useRef } from "react"
import jazzicon from '@metamask/jazzicon'
import * as blockies from 'blockies-ts'
import './index.css'
import { useUserIdenticon } from "../../state/user/hooks"
function getIcon(address: string, iconSize: number, identIcon: string):HTMLElement{
    switch (identIcon) {
        case 'Jazzicon':
            return jazzicon(iconSize, parseInt(address.slice(2, 10), 16))
        case 'Blockies':
            const div = document.createElement('div')
            const img = document.createElement('img')
            img.id = 'img_id'
            img.width = iconSize
            img.className = 'blockies-img'
            img.src = blockies.create({ seed: address.toLowerCase(), scale: 15}).toDataURL()
            div.appendChild(img)
            return div
        default:
            return jazzicon(iconSize, parseInt(address.slice(2, 10), 16))
    }
    //(identIcon === "jazzicon"?jazzicon(iconSize, parseInt(address.slice(2, 10), 16)):<div><img src={blockies.create({ seed: address.toLowerCase(), scale: 15}).toDataURL()} alt="" /></div>
}
export default function IdentIcon({ address, size, preferIdentIcon }: { address: string, size?: number, preferIdentIcon?: string }){
    const userIdentIcon = useUserIdenticon()
    const iconSize = size ?? 24
    const identIcon = preferIdentIcon??userIdentIcon??""
    const icon = useMemo(() => address && getIcon(address, iconSize, identIcon), [address, iconSize, identIcon])
    const iconRef = useRef<HTMLDivElement>(null)
    useLayoutEffect(() => {
        const current = iconRef.current
        if (icon) {
            current?.appendChild(icon)
            return () => {
                try {
                    current?.removeChild(icon)
                } catch (e) {
                    console.error('Avatar icon not found')
                }
            }
        }
        return
    }, [icon, iconRef, identIcon])
    
    return(
        <div style={
            {
                height: iconSize + "px", 
                width: iconSize + "px", 
                borderRadius: "50%",
                fontSize: "initial"
            }}>
            <span ref={iconRef} />
        </div>
    )
}
