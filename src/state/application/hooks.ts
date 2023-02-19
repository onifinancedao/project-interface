import { useCallback, useMemo } from "react";
import { AppState } from '../index'
import { useAppDispatch, useAppSelector } from "../hooks";
import { addPopup, ApplicationModal, PopupContent, removePopup, setOpenModal } from './reducer'
import { DEFAULT_TXN_DISMISS_MS } from "../../constants/misc";

export function useModalIsOpen(modal: ApplicationModal): boolean {
  const openModal = useAppSelector((state: AppState) => state.application.openModal)
  return openModal === modal
}
  
export function useToggleModal(modal: ApplicationModal): () => void {
  const isOpen = useModalIsOpen(modal)
  const dispatch = useAppDispatch()
  return useCallback(() => dispatch(setOpenModal(isOpen ? null : modal)), [dispatch, modal, isOpen])
}

export function useCloseModal(_modal: ApplicationModal): () => void {
  const dispatch = useAppDispatch()
  return useCallback(() => dispatch(setOpenModal(null)), [dispatch])
}
  
export function useToggleConnectWalletModal(): () => void {
  return useToggleModal(ApplicationModal.CONNECT_WALLET)
}

export function useToggleWalletInfoDropdown(): () => void {
  return useToggleModal(ApplicationModal.WALLET_DROPDOWN)
}

export function useToggleSettingsMenu(): () => void {
  return useToggleModal(ApplicationModal.SETTINGS)
}

export function useToggleSettingsMobileMenu(): () => void {
  return useToggleModal(ApplicationModal.SETTINGS_MOBILE)
}

export function useToggleWithdrawClaimableBalanceModal(): () => void {
  return useToggleModal(ApplicationModal.WITHDRAW_CLAIMABLE_BALANCE)
}

// returns a function that allows adding a popup
export function useAddPopup(): (content: PopupContent, key?: string, removeAfterMs?: number) => void {
  const dispatch = useAppDispatch()
  
  return useCallback(
    (content: PopupContent, key?: string, removeAfterMs?: number) => {
      dispatch(addPopup({ content, key, removeAfterMs: removeAfterMs ?? DEFAULT_TXN_DISMISS_MS }))
    },
    [dispatch]
  )
}
  
  // returns a function that allows removing a popup via its key
  export function useRemovePopup(): (key: string) => void {
    const dispatch = useAppDispatch()
    return useCallback(
      (key: string) => {
        dispatch(removePopup({ key }))
      },
      [dispatch]
    )
  }
  
  // get the list of active popups
  export function useActivePopups(): AppState['application']['popupList'] {
    const list = useAppSelector((state: AppState) => state.application.popupList)
    return useMemo(() => list.filter((item) => item.show), [list])
  }