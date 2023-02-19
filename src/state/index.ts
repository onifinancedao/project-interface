import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import multicall from '../lib/state/multicall'
import { load, save } from 'redux-localstorage-simple'

import application from './application/reducer'
//import burn from './burn/reducer'
import connection from './connection/reducer'
import transactions from './transactions/reducer'
import user from './user/reducer'
import wallets from './wallets/reducer'
import logs from './logs/slice'

const PERSISTED_KEYS: string[] = ['user']

const store = configureStore({
  reducer: {
    application,
    user,
    connection,
    transactions,
    wallets,
    //mint,
    //burn,
    multicall: multicall.reducer,
    logs,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({ thunk: true })
    //.concat(routingApi.middleware)
    .concat(save({ states: PERSISTED_KEYS, debounce: 1000 })),
  preloadedState: load({ states: PERSISTED_KEYS, disableWarnings: true }),
  //preloadedState: load({ states: PERSISTED_KEYS }),
})


setupListeners(store.dispatch)

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch