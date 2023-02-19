import { useUserTheme } from "../../state/user/hooks"

import './index.css'

export default function ArrowWrapper(){

    const theme = useUserTheme()

    return(
        <div className={"arrow-wrapper " + theme}>
            <svg xmlns="http://www.w3.org/2000/svg" style={{position:"absolute"}} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6E727D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
        </div>
    )
}