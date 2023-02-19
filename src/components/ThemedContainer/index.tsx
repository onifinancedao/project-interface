import { ReactNode } from "react"
import { useUserTheme } from "../../state/user/hooks"

import './index.css'

export default function ThemedContainer({ children, height, maxWidth, maxHeight, className }: { children?: ReactNode; height?:string ;maxWidth?:string; maxHeight?:string; className?:string }){
    const theme = useUserTheme()
    return(
        <div className={ className+" themed-container " + theme} style={{maxWidth: maxWidth??'480px', height: height??'100%', maxHeight: maxHeight??'100%'}}>
            {children}
        </div>
    )
}