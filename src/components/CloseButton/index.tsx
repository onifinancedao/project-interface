import { useUserTheme } from '../../state/user/hooks'

import Close_Icon from '../../assets/svg/close-icon.svg'

import './index.css'

export default function CloseButton({onClick}:{onClick:()=>void}){
    const theme = useUserTheme()
    return(
        <button className={'close ' + theme } onClick={onClick}>
            <img src={Close_Icon} alt="" />
        </button>
    )
}