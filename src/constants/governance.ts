import {
  CORE_ADDRESS,
  GOVERNOR_ADDRESS,
  TIMELOCK_ADDRESS
} from './addresses'
import { SupportedChainId } from './chains'
import { PROJECT_TOKEN, USD_TOKEN, UTILITY_TOKEN } from './tokens'

export const COMMON_CONTRACT_NAMES: Record<number, { [address: string]: string }> = {
  [SupportedChainId.POLYGON]: {
    [PROJECT_TOKEN.address]: PROJECT_TOKEN?.symbol || '',
    [UTILITY_TOKEN.address]: UTILITY_TOKEN?.symbol || '',
    [USD_TOKEN.address]: USD_TOKEN?.symbol || '',
    [TIMELOCK_ADDRESS]: 'Timelock',
    [GOVERNOR_ADDRESS]: 'Governance',
    [CORE_ADDRESS]: 'Core',
  },
}

export const DEFAULT_AVERAGE_BLOCK_TIME_IN_SECS = 2

// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS: { [chainId: number]: number } = {
  1: DEFAULT_AVERAGE_BLOCK_TIME_IN_SECS,
}