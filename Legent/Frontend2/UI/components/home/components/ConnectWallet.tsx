'use client';

import React from 'react';
import useEthWallet from '../../hooks/useEthWallet';

interface ConnectWalletProps {
  openModal: boolean;
  closeModal: () => void;
}

const ConnectWallet = ({ openModal, closeModal }: ConnectWalletProps) => {
  const { activeAddress, isConnecting, connect, disconnect, error } = useEthWallet();

  return (
    <dialog
      id="connect_wallet_modal"
      className={`modal ${openModal ? 'modal-open' : ''}`}
      style={{ display: openModal ? 'block' : 'none' }}
    >
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-2xl">Connect Wallet</h3>

        <div className="grid m-2 pt-5">
          {activeAddress ? (
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Connected Address:</div>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono break-all">
                {activeAddress}
              </code>
            </div>
          ) : (
            <button
              data-test-id="metamask-connect"
              className="btn border-teal-800 border-1 m-2"
              onClick={() => connect()}
              disabled={isConnecting}
            >
              <img
                alt="MetaMask"
                src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/SVG_MetaMask_Icon_Color.svg"
                style={{ objectFit: 'contain', width: '30px', height: 'auto' }}
              />
              <span>{isConnecting ? 'Connecting…' : 'MetaMask (Sepolia)'}</span>
            </button>
          )}

          {error && (
            <div className="text-red-600 text-sm mt-2 px-2">{error}</div>
          )}
        </div>

        <div className="modal-action grid">
          <button
            data-test-id="close-wallet-modal"
            className="btn"
            onClick={closeModal}
          >
            Close
          </button>
          {activeAddress && (
            <button
              className="btn btn-warning"
              data-test-id="logout"
              onClick={() => {
                disconnect();
                closeModal();
              }}
            >
              Disconnect
            </button>
          )}
        </div>
      </form>
    </dialog>
  );
};

export default ConnectWallet;
