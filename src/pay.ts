import { BrowserProvider, Contract, parseUnits } from 'ethers';
import type { PaymentConfig } from './api';

const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
];

export async function payWithUSDT(
  total: string,
  config: PaymentConfig,
): Promise<string> {
  const eth = (window as any).ethereum;
  if (!eth) throw new Error('MetaMask not found');
  if (!config.tokenAddress || !config.walletAddress) {
    throw new Error('This shop has no payment wallet configured yet');
  }

  const provider = new BrowserProvider(eth);
  const signer = await provider.getSigner();
  const usdt = new Contract(config.tokenAddress, ERC20_ABI, signer);

  const amount = parseUnits(total, 6);
  const tx = await usdt.transfer(config.walletAddress, amount);
  await tx.wait();
  return tx.hash;
}