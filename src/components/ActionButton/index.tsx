import { ReactNode } from "react";
import { useUserTheme } from "../../state/user/hooks";

import './index.css'

export default function ActionButton(
        {
            children, 
            onClick, 
            disabled,
            maxWidth
        }:{
            children?:ReactNode | undefined;
            onClick?:()=>any | undefined;
            disabled?: boolean | undefined;
            maxWidth?: string;
        }
    ){
        const theme = useUserTheme()
        return(
            <button 
            className={"action-button " + theme} 
            disabled={disabled??false} 
            onClick={()=>{onClick && onClick()}}
            style={maxWidth?{maxWidth}:{}}
            >
                {children}
            </button>
        )
}