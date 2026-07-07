import { useState } from 'react';
import { BrowserProvider } from 'ethers';

const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState('');

  const connect = async () => {
    setError('');
    const eth = (window as any).ethereum;
    if (!eth) {
      setError('MetaMask not found. Please install it.');
      return;
    }
    try {
      await eth.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
      const provider = new BrowserProvider(eth);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return { account, error, connect };
}