/**
 * Web3 Configuration for Caster Colony
 * Target: Base Mainnet
 */

import { http, createConfig, createStorage, cookieStorage } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'
import { baseAccount } from 'wagmi/connectors';

// We are using a public provider. In a full production setup with a real dApp,
// you would use Alchemy or an RPC provider using your own API keys.
export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    baseAccount({
      appName: 'Caster Colony',
    }),
    // Replace with a real WalletConnect project ID in production
    walletConnect({ projectId: '3fcc6bba6f1de962d911bb5b5c3dba68' }),
  ],
  transports: {
    [base.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

