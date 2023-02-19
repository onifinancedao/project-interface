import { DialogContent, DialogOverlay } from '@reach/dialog'
import React from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useDarkModeManager } from '../../state/user/hooks'
import "./index.css"

interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  minHeight?: number | false
  maxHeight?: number
  maxWidth?: string
  initialFocusRef?: React.RefObject<any>
  children?: React.ReactNode
  scrollOverlay?: boolean
}

export default function Modal({
  isOpen,
  onDismiss,
  minHeight = false,
  maxHeight = 80,
  maxWidth = "420px",
  initialFocusRef,
  children,
  scrollOverlay,
}: ModalProps) {
  const isMobile = useIsMobile()
  const[darkMode, ] = useDarkModeManager()
  return(
    <DialogOverlay isOpen={isOpen} onDismiss={onDismiss}
      style={
        {
          backgroundColor: (darkMode?"rgb(9 10 17 / 50%)":"rgba(101,108,133,0.8)"),
        }
      }
    >
      <DialogContent
        className='mx-2' 
        style={
          {
            maxWidth: maxWidth, 
            display: (scrollOverlay ? 'inline-table' : 'flex'),
            maxHeight: maxHeight+"vh",
            minHeight: minHeight+"vh",
          }
        }
      >
        {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
        {!initialFocusRef && isMobile ? <div tabIndex={1} /> : null}
        {children}
      </DialogContent>
    </DialogOverlay>
  )
}