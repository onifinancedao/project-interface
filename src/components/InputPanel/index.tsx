import { RefObject } from "react"

import { useUserTheme } from "../../state/user/hooks"

import './index.css'

interface AdvancedInputProps{
    inputReference?:RefObject<HTMLInputElement>;
    url:string;
    logoUrl:string;
    symbol:string;
    smallText?:JSX.Element;
    smallBtn?:JSX.Element;
    disabled?:boolean;
    placeHolder?:string;
    onInput?: () => void;
 }
 export const AdvancedCurrencyInputPanel = ({inputReference, url, logoUrl, symbol, smallText, smallBtn, disabled, placeHolder, onInput}: AdvancedInputProps) => {
     const theme = useUserTheme()
     return(
         <div className="input-panel">
             <div 
                className={"input-panel-container " + theme}>
                 <div className="input-panel-row">
                   <input className={"input-currency " + theme}
                   onInput={onInput}
                   disabled={disabled?disabled:false}
                   ref={inputReference?inputReference:null}
                   inputMode="numeric" 
                   autoComplete="off" 
                   autoCorrect="off" 
                   type="text" 
                   placeholder={placeHolder?placeHolder:"0"}
                   spellCheck="false"/>
                   <a className={"currency-input-button " + theme} href={ url } target='_blank' rel='noopener noreferrer'>
                     <span className="currency-input-aligner">
                       <div className="currency-input">
                         <img className="currency-input-logo" alt="logo" src={ logoUrl }/>
                         <span className="currency-input-symbol">{ symbol }</span>
                       </div>
                     </span>
                   </a>
                 </div>
                 { 
                   smallText && <div className="px-3 pb-3 d-flex justify-content-between">
                   <div>{smallBtn}</div>
                   <div className={"currency-input-balance " + theme } style={{height: "17px",width: "fit-content"}}>
                     { smallText }
                   </div>
                 </div>
                 }
             </div>
         </div>
     );
 }
 interface SimpleInputProps{
     value:string;
     logoUrl:string;
     symbol:string;
  }
 export const SimpleCurrencyInputPanel = ({value, logoUrl, symbol}:SimpleInputProps) =>{
    const theme = useUserTheme()
     return(
         <div className="input-panel">
           <div 
             className={ "input-panel-container input-panel-container-border " + theme }
             >
               <div className="input-panel-row">
                 <div className={"input-currency " + theme}>
                   { value }
                 </div>
                 <div>
                   <span className="currency-input-aligner">
                     <div className="currency-input">
                       <img className="currency-input-logo" alt="logo" src={ logoUrl }/>
                       <span className="currency-input-symbol">{ symbol }</span>
                     </div>
                   </span>
                 </div>
               </div>
             </div>
         </div>
     );
 }