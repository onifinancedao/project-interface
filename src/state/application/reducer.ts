import { createSlice, nanoid } from '@reduxjs/toolkit'
import { DEFAULT_TXN_DISMISS_MS } from '../../constants/misc'

import { SupportedChainId } from '../../constants/chains'

export type PopupContent =
  | {
      txn: {
        hash: string
      }
    }
  | {
      failedSwitchNetwork: SupportedChainId
    }

export enum ApplicationModal {
  SETTINGS,
  SETTINGS_MOBILE,
  CLAIM_POPUP,
  CONNECT_WALLET,
  WALLET_DROPDOWN,
  WITHDRAW_CLAIMABLE_BALANCE,
  DELEGATE,
  PROPOSAL_ACTION_TRANSFER_APPROVE,
  PROPOSAL_ACTION_ACTIVATE_EMERGENCY,
  PROPOSAL_ACTION_DECLINE_DEV_REWARD,
  PROPOSAL_ACTION_COMMUNITY_RAFFLE,
  PROPOSAL_ACTION_CUSTOM,
  PROPOSAL_PREVIEW,
  VIEW_VOTERS,
  CANCEL,
  VOTE,
  QUEUE,
  EXECUTE,
  BURN,
  EXCHANGE,
  NETWORK_ERROR,
  
  ADDRESS_CLAIM,
  BLOCKED_ACCOUNT,
  
  SELF_CLAIM,
  
  
  TIME_SELECTOR,
  SHARE,
  NETWORK_FILTER,
  FEATURE_FLAGS,
}

type PopupList = Array<{ key: string; show: boolean; content: PopupContent; removeAfterMs: number | null }>

export interface ApplicationState {
  readonly chainId: number | null
  readonly openModal: ApplicationModal | null
  readonly popupList: PopupList
}

const initialState: ApplicationState = {
  chainId: null,
  openModal: null,
  popupList: [],
}

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    updateChainId(state, action) {
      const { chainId } = action.payload
      state.chainId = chainId
    },
    setOpenModal(state, action) {
      state.openModal = action.payload
    },
    addPopup(state, { payload: { content, key, removeAfterMs = DEFAULT_TXN_DISMISS_MS } }) {
      state.popupList = (key ? state.popupList.filter((popup) => popup.key !== key) : state.popupList).concat([
        {
          key: key || nanoid(),
          show: true,
          content,
          removeAfterMs,
        },
      ])
    },
    removePopup(state, { payload: { key } }) {
      state.popupList.forEach((p) => {
        if (p.key === key) {
          p.show = false
        }
      })
    },
  },
})

export const { updateChainId, setOpenModal, addPopup, removePopup } = applicationSlice.actions
export default applicationSlice.reducer