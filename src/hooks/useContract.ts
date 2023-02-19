import { useWeb3React } from '@web3-react/core'
import { Contract } from '@ethersproject/contracts'


import ERC20_ABI from '../abis/erc20.json'
import PROJECT_CONTRACT_ABI from '../abis/ofp.json'
import CORE_ABI from '../abis/core.json'
import GOVERNOR_ABI from '../abis/governor.json'
import TIME_LOCK_ABI from '../abis/timelock.json'
import UniswapInterfaceMulticallJson from '../abis/UniswapInterfaceMulticall.json'

import { Erc20, Ofp, Governor, Timelock, UniswapInterfaceMulticall, Core } from '../abis/types'

import { CORE_ADDRESS, GOVERNOR_ADDRESS, TIMELOCK_ADDRESS, MULTICALL_ADDRESS } from '../constants/addresses'
import { PROJECT_TOKEN } from '../constants/tokens'
import { useMemo } from 'react'

import { getContract } from '../utils'

const { abi: MulticallABI } = UniswapInterfaceMulticallJson

// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { provider, account, chainId } = useWeb3React()

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !provider || !chainId) return null
    let address: string | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract(address, ABI, provider, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, ABI, provider, chainId, withSignerIfPossible, account]) as T
}


export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useProjectContract(withSignerIfPossible?: boolean) {
  return useContract<Ofp>(PROJECT_TOKEN.address, PROJECT_CONTRACT_ABI, withSignerIfPossible)
}

export function useCoreContract(withSignerIfPossible?: boolean) {
  return useContract<Core>(CORE_ADDRESS, CORE_ABI, withSignerIfPossible)
}

export function useGovernorContract(withSignerIfPossible?: boolean) {
  return useContract<Governor>(GOVERNOR_ADDRESS, GOVERNOR_ABI, withSignerIfPossible)
}

export function useTimelockContract(withSignerIfPossible?: boolean) {
  return useContract<Timelock>(TIMELOCK_ADDRESS, TIME_LOCK_ABI, withSignerIfPossible)
}

export function useInterfaceMulticall() {
  return useContract<UniswapInterfaceMulticall>(MULTICALL_ADDRESS, MulticallABI, false) as UniswapInterfaceMulticall
}