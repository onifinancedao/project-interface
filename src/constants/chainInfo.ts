
import polygonLogo from '../assets/svg/polygon-matic-logo.svg'
import ms from 'ms.macro'

import { SupportedChainId } from './chains'

export enum NetworkType {
  L1,
}

interface BaseChainInfo {
  readonly networkType: NetworkType
  readonly blockWaitMsBeforeWarning?: number
  readonly docs: string
  readonly bridge?: string
  readonly explorer: string
  readonly infoLink: string
  readonly logoUrl: string
  readonly circleLogoUrl?: string
  readonly label: string
  readonly helpCenterUrl?: string
  readonly nativeCurrency: {
    name: string // e.g. 'Goerli ETH',
    symbol: string // e.g. 'gorETH',
    decimals: number // e.g. 18,
  }
  readonly color?: string
  readonly backgroundColor?: string
}

export interface L1ChainInfo extends BaseChainInfo {
  readonly networkType: NetworkType.L1
  readonly defaultListUrl?: string
}

export type ChainInfoMap = { readonly [chainId: number]: L1ChainInfo }

const CHAIN_INFO: ChainInfoMap = {

  [SupportedChainId.POLYGON]: {
    networkType: NetworkType.L1,
    blockWaitMsBeforeWarning: ms`10m`,
    bridge: 'https://wallet.polygon.technology/bridge',
    docs: 'https://polygon.io/',
    explorer: 'https://polygonscan.com',
    infoLink: '',
    label: 'Polygon',
    logoUrl: polygonLogo,
    nativeCurrency: { name: 'Polygon', symbol: 'MATIC', decimals: 18 },
  },
}

export function getChainInfo(chainId: SupportedChainId): L1ChainInfo
export function getChainInfo(
  chainId: SupportedChainId | number | undefined
): L1ChainInfo | undefined

export function getChainInfo(chainId: any): any {
  if (chainId) {
    return CHAIN_INFO[chainId] ?? undefined
  }
  return undefined
}

export const MAINNET_INFO = CHAIN_INFO[SupportedChainId.POLYGON]
export function getChainInfoOrDefault(chainId: number | undefined) {
  return getChainInfo(chainId) ?? MAINNET_INFO
}
