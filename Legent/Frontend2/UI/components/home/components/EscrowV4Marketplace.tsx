'use client';

/**
 * EscrowV4Marketplace — Ethereum Sepolia version
 * Replaces the Algorand escrow V4 marketplace component.
 *
 * Reads trades from the deployed TradeEscrow.sol contract and allows
 * buyers / financiers to fund escrow using cvUSD ERC-20.
 */
import React, { useState, useEffect } from 'react';
import useEthWallet from '../../hooks/useEthWallet';
import escrowEthService, {
  EscrowTrade,
  TradeState,
} from '../../services/escrowEthService';
import { getEthConfig, getExplorerUrl } from '../../utils/network/getEthConfig';
import { ethers } from 'ethers';
import { ERC20_ABI } from '../../services/ethService';

const STATE_LABELS: Record<number, { label: string; color: string }> = {
  [TradeState.CREATED]: { label: 'CREATED — Awaiting Funding', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  [TradeState.ESCROWED]: { label: 'ESCROWED — Funded', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  [TradeState.EXECUTED]: { label: 'EXECUTED', color: 'bg-green-100 text-green-800 border-green-300' },
  [TradeState.PAYMENT_ACKNOWLEDGED]: { label: 'PAYMENT ACKNOWLEDGED', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  [TradeState.EXPIRED]: { label: 'EXPIRED', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  [TradeState.COMPLETED]: { label: 'COMPLETED', color: 'bg-green-100 text-green-800 border-green-300' },
};

const MARKETPLACE_FEE_BPS = 25n; // 0.25%

export const EscrowV4Marketplace: React.FC = () => {
  const { activeAddress } = useEthWallet();
  const [trades, setTrades] = useState<EscrowTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fundingTradeId, setFundingTradeId] = useState<number | null>(null);
  const config = getEthConfig();

  useEffect(() => {
    if (config.escrowContractAddress) loadTrades();
    else {
      setLoading(false);
      setError('Escrow contract address not configured. Set NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS in .env.local');
    }
  }, [config.escrowContractAddress]);

  const loadTrades = async () => {
    try {
      setLoading(true);
      const all = await escrowEthService.getAllTrades();
      all.sort((a, b) => b.tradeId - a.tradeId);
      setTrades(all);
    } catch (err: any) {
      setError('Failed to load marketplace trades: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleFundEscrow = async (trade: EscrowTrade, asFinancier: boolean) => {
    if (!activeAddress) { setError('Connect MetaMask first'); return; }
    setFundingTradeId(trade.tradeId);
    setError('');
    setSuccess('');

    try {
      // Format amount for approval (with fee)
      const totalAmount = trade.amount + (trade.amount * MARKETPLACE_FEE_BPS) / 10000n;
      const provider = new ethers.JsonRpcProvider(config.rpcUrl);
      const token = new ethers.Contract(config.cvUsdAddress, ERC20_ABI, provider);
      const decimals: bigint = await token.decimals();
      const humanAmount = ethers.formatUnits(totalAmount, decimals);

      // Approve
      await escrowEthService.approveCvUSDForEscrow(humanAmount);

      // Fund
      const result = asFinancier
        ? await escrowEthService.escrowTradeAsFinancier(trade.tradeId)
        : await escrowEthService.escrowTrade(trade.tradeId);

      setSuccess(
        `✅ Trade #${trade.tradeId} funded! ` +
          `<a href="${result.explorerUrl}" target="_blank" class="underline text-blue-600">View on Etherscan</a>`
      );
      await loadTrades();
    } catch (err: any) {
      setError('Failed to fund escrow: ' + (err.message || err));
    } finally {
      setFundingTradeId(null);
    }
  };

  const formatAmount = (wei: bigint) => {
    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    // cvUSD has 18 decimals by default (same as ETH) — adjust if your deployment differs
    return ethers.formatUnits(wei, 18);
  };

  const formatDate = (ts: bigint) =>
    new Date(Number(ts) * 1000).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading marketplace trades…</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trade Escrow Marketplace</h1>
        <p className="text-gray-600">Browse and fund trade opportunities on Ethereum Sepolia</p>
        {config.escrowContractAddress && (
          <a
            href={`https://sepolia.etherscan.io/address/${config.escrowContractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 underline"
          >
            Contract: {config.escrowContractAddress.substring(0, 20)}…
          </a>
        )}
      </div>

      {success && (
        <div
          className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg"
          dangerouslySetInnerHTML={{ __html: success }}
        />
      )}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Trades', value: trades.length, cls: 'text-gray-900' },
          { label: 'Awaiting Funding', value: trades.filter((t) => t.state === TradeState.CREATED).length, cls: 'text-yellow-600' },
          { label: 'Funded', value: trades.filter((t) => t.state === TradeState.ESCROWED).length, cls: 'text-blue-600' },
          { label: 'Completed', value: trades.filter((t) => t.state === TradeState.COMPLETED).length, cls: 'text-green-600' },
        ].map(({ label, value, cls }) => (
          <div key={label} className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">{label}</div>
            <div className={`text-2xl font-bold ${cls}`}>{value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Available Trades</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {trades.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No trades found. Create the first trade from the Exporter dashboard.
            </div>
          ) : (
            trades.map((trade) => {
              const isBuyer = trade.buyer.toLowerCase() === (activeAddress || '').toLowerCase();
              const canFund = trade.state === TradeState.CREATED;
              const totalAmount = trade.amount + (trade.amount * MARKETPLACE_FEE_BPS) / 10000n;

              return (
                <div key={trade.tradeId} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Trade #{trade.tradeId}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATE_LABELS[trade.state]?.color}`}>
                          {STATE_LABELS[trade.state]?.label || 'UNKNOWN'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div><span className="font-medium">Product:</span> {trade.productType}</div>
                        <div><span className="font-medium">Description:</span> {trade.description}</div>
                        <div className="flex items-center gap-4 mt-2">
                          <div>
                            <span className="font-medium">Buyer:</span>{' '}
                            <span className="font-mono text-xs">{trade.buyer.slice(0, 8)}…{trade.buyer.slice(-6)}</span>
                            {isBuyer && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">You</span>}
                          </div>
                          <div>
                            <span className="font-medium">Seller:</span>{' '}
                            <span className="font-mono text-xs">{trade.seller.slice(0, 8)}…{trade.seller.slice(-6)}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">Created: {formatDate(trade.createdAt)}</div>
                      </div>
                    </div>

                    <div className="ml-6 text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {formatAmount(trade.amount)} cvUSD
                      </div>
                      {canFund && (
                        <div className="text-xs text-gray-500 mb-3">
                          Total (incl. fee): {formatAmount(totalAmount)} cvUSD
                        </div>
                      )}
                      {canFund && activeAddress && (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleFundEscrow(trade, false)}
                            disabled={fundingTradeId === trade.tradeId}
                            className="px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-sm"
                          >
                            {fundingTradeId === trade.tradeId ? '⏳ Funding…' : '💰 Fund as Buyer'}
                          </button>
                          <button
                            onClick={() => handleFundEscrow(trade, true)}
                            disabled={fundingTradeId === trade.tradeId}
                            className="px-4 py-2 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-sm"
                          >
                            🏦 Fund as Financier
                          </button>
                        </div>
                      )}
                      {!activeAddress && canFund && (
                        <div className="text-xs text-gray-500">Connect MetaMask to fund</div>
                      )}
                      {trade.state === TradeState.ESCROWED && (
                        <div className="text-sm text-green-600 font-medium">✓ Funded</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default EscrowV4Marketplace;
