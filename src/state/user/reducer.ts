import { createSlice } from '@reduxjs/toolkit'
import { ConnectionType } from '../../connection'
import { SupportedIdenticon } from '../../constants/identicon'
import { SupportedLocale } from '../../constants/locales'

const currentTimestamp = () => new Date().getTime()



export interface UserState {
  selectedWallet?: ConnectionType
  darkMode: boolean
  userIdenticon : SupportedIdenticon | 'Jazzicon'
  userLocale: SupportedLocale | null
  timestamp: number
  visibleDisclaimer: boolean
  reducedVerticalMenu: boolean
}


export const initialState: UserState = {
  selectedWallet: undefined,
  darkMode: false,
  userIdenticon: 'Jazzicon',
  userLocale: null,
  timestamp: currentTimestamp(),
  visibleDisclaimer: true,
  reducedVerticalMenu: false
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

    updateSelectedWallet(state, { payload: { wallet } }) {
      state.selectedWallet = wallet
    },
    updateDarkMode(state, action) {
      state.darkMode = action.payload.darkMode
      state.timestamp = currentTimestamp()
    },
    updateUserIdenticon(state, action) {
      state.userIdenticon = action.payload.userIdenticon
      state.timestamp = currentTimestamp()
    },
    updateUserLocale(state, action) {
      state.userLocale = action.payload.userLocale
      state.timestamp = currentTimestamp()
    },
    updateUserVisibleDisclaimer(state, action) {
      state.visibleDisclaimer = action.payload.visibleDisclaimer
      state.timestamp = currentTimestamp()
    },
    updateReducedVerticalMenu(state, action) {
      state.reducedVerticalMenu = action.payload.reducedVerticalMenu
      state.timestamp = currentTimestamp()
    },
    
  },
})

export const {
  updateSelectedWallet,
  updateDarkMode,
  updateUserIdenticon,
  updateUserLocale,
  updateUserVisibleDisclaimer,
  updateReducedVerticalMenu,
} = userSlice.actions
export default userSlice.reducer