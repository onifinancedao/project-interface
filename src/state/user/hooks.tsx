import { useWeb3React } from '@web3-react/core'
import { useCallback } from 'react'
import type { TransactionResponse } from '@ethersproject/providers'
import { t } from '@lingui/macro'

import { AppState } from '../index'

import {
  updateDarkMode,
  updateUserIdenticon,
  updateUserLocale,
  updateUserVisibleDisclaimer,
  updateReducedVerticalMenu,
} from './reducer'

import { useAppDispatch, useAppSelector } from '../../state/hooks'
import { useCoreContract, useProjectContract } from '../../hooks/useContract'
import { useTransactionAdder } from '../transactions/hooks'

import { ConnectionType } from '../../connection'

import { calculateGasMargin } from '../../utils/calculateGasMargin'
import { isAddress } from 'ethers/lib/utils'
import { transactionErrorToUserReadableMessage } from '../../utils/transactionErrorToUserReadableMessage'

import { SupportedIdenticon } from '../../constants/identicon'
import { SupportedLocale } from '../../constants/locales'
import { USD_TOKEN } from '../../constants/tokens'
import { TransactionType } from '../transactions/types'
import JSBI from 'jsbi'
import { useSingleCallResult } from '../../lib/hooks/multicall'

export function useUserSelectedWallet(): ConnectionType | undefined

{
  return useAppSelector((state) => state.user.selectedWallet)
}

export function useDarkModeManager(): [boolean, (setDarkMode:boolean) => void] {
  const dispatch = useAppDispatch()
  const { darkMode } = useAppSelector(
    ({ user: { darkMode } }) => ({
      darkMode,
    }),
  )

  const setDarkMode = useCallback((setDarkMode:boolean) => {
    dispatch(updateDarkMode({ darkMode: setDarkMode }))
  }, [darkMode, dispatch])

  return [darkMode, setDarkMode]
}



export function useUserTheme(): string {
  const [darkMode] = useDarkModeManager()
  return darkMode?"dark":"light"
}
export function useUserIdenticon(): SupportedIdenticon | null

{
  return useAppSelector((state) => state.user.userIdenticon)
}

export function useUserIdenticonManager(): [SupportedIdenticon, (setUserIdenticon:SupportedIdenticon) => void] {
  const dispatch = useAppDispatch()
  const { userIdenticon } = useAppSelector(
    ({ user: { userIdenticon } }) => ({
      userIdenticon,
    }),
  )

  const setUserIdenticon = useCallback(
    (newUserIdenticon:SupportedIdenticon) => {
      dispatch(updateUserIdenticon({ userIdenticon: newUserIdenticon }))
  }, [dispatch])


  return [userIdenticon, setUserIdenticon]
}

export function useUserLocale(): SupportedLocale | null {
  return useAppSelector((state) => state.user.userLocale)
}

export function useUserLocaleManager(): [SupportedLocale | null, (newLocale: SupportedLocale) => void] {
  const dispatch = useAppDispatch()
  const locale = useUserLocale()

  const setLocale = useCallback(
    (newLocale: SupportedLocale) => {
      dispatch(updateUserLocale({ userLocale: newLocale }))
    },
    [dispatch]
  )

  return [locale, setLocale]
}

export function useUserVisibleDisclaimer(): boolean {
  return useAppSelector((state: AppState) => state.user.visibleDisclaimer)
}

export function useUserVisibleDisclaimerManager(): [boolean, (setVisibleDisclaimer:boolean) => void] {
  const dispatch = useAppDispatch()
  const { visibleDisclaimer } = useAppSelector(
    ({ user: { visibleDisclaimer } }) => ({
      visibleDisclaimer,
    }),
  )

  const setVisibleDisclaimer = useCallback((setVisibleDisclaimer:boolean) => {
    dispatch(updateUserVisibleDisclaimer({ visibleDisclaimer: setVisibleDisclaimer }))
  }, [visibleDisclaimer, dispatch])

  return [visibleDisclaimer, setVisibleDisclaimer]
}

export function useReducedVerticalMenuManager(): [boolean, () => void] {
  const dispatch = useAppDispatch()
  const { reducedVerticalMenu } = useAppSelector(
    ({ user: { reducedVerticalMenu } }) => ({
      reducedVerticalMenu,
    }),
  )

  const toggleReducedVerticalMenu = useCallback(() => {
    dispatch(updateReducedVerticalMenu({ reducedVerticalMenu: !reducedVerticalMenu }))
  }, [reducedVerticalMenu, dispatch])
  return [reducedVerticalMenu, toggleReducedVerticalMenu]
}

export function useClaimableBalance(): JSBI | undefined {
  const { account } = useWeb3React()
  const coreContract = useCoreContract()
  const res = useSingleCallResult(coreContract, 'claimableBalance',[account])
  return res.result && JSBI.BigInt(res.result[0].toString())
}

export function useTokenURI(token: string): string | undefined {
  const projectContract = useProjectContract()
  const res = useSingleCallResult(projectContract, 'tokenURI',[token])
  return res?.result?.[0]
}

export function useTokensOfOwner(owner: string | undefined): JSBI[] | undefined {
  const projectContract = useProjectContract()
  const res = useSingleCallResult(projectContract, 'tokensOfOwner',[owner])
  console.log(res)
  if(res.result){
    let tokens:JSBI[] = []
    for (let i = 0; i < res.result[0].length; i++) {
      tokens.push(JSBI.BigInt(res.result[0][i].toString()))
    }
    return tokens
  }else{
    return undefined
  }
}

export function useWithdrawClaimableBalanceCallback(): (to: string | undefined, rawAmount: string | undefined) => undefined | Promise<string> {
  const { account, chainId, provider } = useWeb3React()
  const addTransaction = useTransactionAdder()

  const coreContract = useCoreContract(true)
  return useCallback(
    (to, rawAmount) => {
      if (!coreContract || !provider || !chainId || !account || !rawAmount || !to || !isAddress(to)) return undefined

      return coreContract.estimateGas.withdrawClaimableBalance(to, rawAmount).then((estimatedGasLimit) => {
        return coreContract
          .withdrawClaimableBalance(to, rawAmount,{ gasLimit: calculateGasMargin(estimatedGasLimit) })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              type: TransactionType.WITHDRAW,
              currencyAmountRaw: rawAmount,
              currencyAddress: USD_TOKEN.address
            })
            return response.hash
          }).catch((error) => {
            throw new Error(`${transactionErrorToUserReadableMessage(error)}`)
          })
      })
    },
    [account, addTransaction, chainId, provider, coreContract]
  )
}