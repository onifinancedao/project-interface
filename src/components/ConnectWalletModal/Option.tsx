import React from 'react'

import { useDarkModeManager } from '../../state/user/hooks'
import Check_Icon from "../../assets/svg/check-icon.svg"
export default function Option({
  link = null,
  clickable = true,
  size,
  onClick = null,
  color,
  header,
  subheader,
  icon,
  isActive = false,
  id,
}: {
  link?: string | null
  clickable?: boolean
  size?: number | null
  onClick?: null | (() => void)
  color: string
  header: React.ReactNode
  subheader?: React.ReactNode
  icon: string
  isActive?: boolean
  id: string
}) {
  const [darkMode,] = useDarkModeManager()
  
  return(
    <div className='col-12 my-1'
      id={id}
      onClick={ onClick? onClick : ()=>{} }
      
      style={
        {
          cursor:(clickable && !isActive?"pointer":"auto"), 
          backgroundColor: (darkMode?"rgb(52 56 82)":"#e0e2e5b3"), 
          borderRadius: "5px",
          border: (isActive?"1px solid " + (darkMode?"#777985":"#adafb1"):"none")
        }
      }
    >
      <div className='row'>
        <div className='col-12 p-3 d-flex'>
          <img className='me-3' style={{height: (size ? size + 'px' : '28px'), width: (size ? size + 'px' : '28px')}}
            src={icon} alt={'Icon'} />
          <div className='align-self-center d-flex'>
            <h6 className='fw-semibold mb-0 align-self-center'>{header}</h6>
            {subheader && <div style={{fontSize: "12px"}}>{subheader}</div>}
            
            {isActive && <img className='ms-1' style={{height: "20px", width: "20px", filter:(darkMode?"invert(61%) sepia(5%) saturate(688%) hue-rotate(194deg) brightness(92%) contrast(88%)":"invert(45%) sepia(8%) saturate(78%) hue-rotate(169deg) brightness(83%) contrast(83%)")}}
            src={Check_Icon} alt={'Check'} />}
          </div>
        </div>
      </div>
    </div>
  )
}
