import type { Metadata } from 'next'
import './globals.css'
import Navigation from './Navigation'
import { EthWalletProvider } from './lib/xrpl-context'

export const metadata: Metadata = {
  title: 'CRE - Trade Finance Platform',
  description: 'Enterprise Trade Finance Platform powered by Chainlink Runtime Environment on Ethereum Sepolia',
  keywords: ['CRE', 'Chainlink', 'Ethereum', 'Sepolia', 'Trade Finance', 'Blockchain', 'KERI', 'vLEI'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <EthWalletProvider>
          <Navigation />
          {children}
        </EthWalletProvider>
      </body>
    </html>
  )
}
