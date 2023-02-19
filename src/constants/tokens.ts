import { SupportedChainId } from "./chains"
import USD_ICON_URL from "../assets/svg/usdc-icon.svg"
import UTILITY_ICON_URL from "../assets/svg/ofi-icon.svg"
import PROJECT_ICON_URL from "../assets/svg/ofp-icon.svg"
import { Currency, NativeCurrency, Token } from "../sdk-core"

export const PROJECT_TOKEN = new Token (
    SupportedChainId.POLYGON,
    '0xAF85076897443d7292317B5BF28d5FC1838a94BF',
    0,
    'OFP',
    'Onifinance Project',
    false,
    PROJECT_ICON_URL
)

export const USD_TOKEN = new Token (
    SupportedChainId.POLYGON,
    '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    6,
    'USDC',
    'USD Coin',
    false,
    USD_ICON_URL
)

export const UTILITY_TOKEN = new Token (
    SupportedChainId.POLYGON,
    '0xddB76a409184343fd9Af495AB60315caFAE15D1E',
    18,
    'OFI',
    'Onifinance',
    false,
    UTILITY_ICON_URL
)
  
  class MaticNativeCurrency extends NativeCurrency {
    equals(other: Currency): boolean {
        throw new Error("Method not implemented.")
    }
    get wrapped(): Token {
        throw new Error("Method not implemented.")
    }
  
    public constructor(chainId: number) {
      super(chainId, 18, 'MATIC', 'Polygon Matic')
    }
}

const cachedNativeCurrency: { [chainId: number]: NativeCurrency | Token } = {}

export function nativeOnChain(chainId: number): NativeCurrency | Token {
  if (cachedNativeCurrency[chainId]) return cachedNativeCurrency[chainId]
  let nativeCurrency: NativeCurrency | Token
    nativeCurrency = new MaticNativeCurrency(chainId)
  return (cachedNativeCurrency[chainId] = nativeCurrency)
}