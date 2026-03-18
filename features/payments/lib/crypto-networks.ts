export const CRYPTO_NETWORK_OPTIONS = [
  'Ethereum',
  'Polygon',
  'Arbitrum',
  'Optimism',
  'Base',
  'Solana',
  'Tron',
  'BSC',
] as const

export type CryptoNetworkOption = (typeof CRYPTO_NETWORK_OPTIONS)[number]

export function resolveCryptoNetwork(network?: string) {
  return CRYPTO_NETWORK_OPTIONS.find((option) => option === network) ?? 'Polygon'
}
