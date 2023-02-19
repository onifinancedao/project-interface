
export const DefaultChainId = 137
/**
 * List of all the networks supported by the Onifinance Interface
 */
 export enum SupportedChainId {
    
    POLYGON = 137,
  }
  
  export const CHAIN_IDS_TO_NAMES = {
    
    [SupportedChainId.POLYGON]: 'polygon',
    
  }
  
  /**
   * Array of all the supported chain IDs
   */
  export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(SupportedChainId).filter(
    (id) => typeof id === 'number'
  ) as SupportedChainId[]
  
  export function isSupportedChain(chainId: number | null | undefined): chainId is SupportedChainId {
    return !!chainId && !!SupportedChainId[chainId]
  }
  
  export const SUPPORTED_GAS_ESTIMATE_CHAIN_IDS = [
    SupportedChainId.POLYGON,
  ]

  export const L1_CHAIN_IDS = [
    SupportedChainId.POLYGON,
  ] as const