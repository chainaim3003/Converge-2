'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { ethers } from 'ethers'

const ETH_RPC_URL = process.env.NEXT_PUBLIC_ETH_RPC_URL || 'https://rpc.sepolia.org'
const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '11155111', 10)
const CVUSD_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CVUSD_CONTRACT_ADDRESS || ''
const SEPOLIA_EXPLORER = process.env.NEXT_PUBLIC_SEPOLIA_EXPLORER || 'https://sepolia.etherscan.io'

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function transfer(address to, uint256 amount) returns (bool)',
]

export interface EthWalletContextType {
  account: string | null
  chainId: number | null
  isConnected: boolean
  isConnecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
  getCvUSDBalance: (address: string) => Promise<string>
  getExplorerUrl: (txHash: string) => string
  lastError: string | null
}

const EthWalletContext = createContext<EthWalletContextType | null>(null)

export function EthWalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [lastError, setLastError] = useState<string | null>(null)

  const isConnected = account !== null

  const connect = useCallback(async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      setLastError('MetaMask not found. Install MetaMask at https://metamask.io')
      return
    }
    setIsConnecting(true)
    setLastError(null)
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const accounts: string[] = await provider.send('eth_requestAccounts', [])
      if (accounts.length === 0) throw new Error('No accounts returned from MetaMask')
      const network = await provider.getNetwork()
      setAccount(accounts[0])
      setChainId(Number(network.chainId))
      console.log(`MetaMask connected: ${accounts[0]} on chain ${network.chainId}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'MetaMask connection failed'
      setLastError(message)
      console.error('MetaMask connection error:', error)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setAccount(null)
    setChainId(null)
  }, [])

  const getCvUSDBalance = useCallback(async (address: string): Promise<string> => {
    if (!CVUSD_CONTRACT_ADDRESS) return '0'
    const provider = new ethers.JsonRpcProvider(ETH_RPC_URL)
    const contract = new ethers.Contract(CVUSD_CONTRACT_ADDRESS, ERC20_ABI, provider)
    const balance: bigint = await contract.balanceOf(address)
    const decimals: bigint = await contract.decimals()
    return ethers.formatUnits(balance, decimals)
  }, [])

  const getExplorerUrl = useCallback((txHash: string): string => {
    return `${SEPOLIA_EXPLORER}/tx/${txHash}`
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const eth = (window as any).ethereum
    if (!eth || typeof eth.on !== 'function') return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount(null)
        setChainId(null)
      } else {
        setAccount(accounts[0])
      }
    }

    const handleChainChanged = (chainIdHex: string) => {
      setChainId(parseInt(chainIdHex, 16))
    }

    eth.on('accountsChanged', handleAccountsChanged)
    eth.on('chainChanged', handleChainChanged)

    return () => {
      if (typeof eth.removeListener === 'function') {
        eth.removeListener('accountsChanged', handleAccountsChanged)
        eth.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

  const value: EthWalletContextType = {
    account, chainId, isConnected, isConnecting,
    connect, disconnect, getCvUSDBalance, getExplorerUrl, lastError,
  }

  return (
    <EthWalletContext.Provider value={value}>
      {children}
    </EthWalletContext.Provider>
  )
}

export function useEthWallet() {
  const context = useContext(EthWalletContext)
  if (!context) throw new Error('useEthWallet must be used within EthWalletProvider')
  return context
}
