import { BrowserProvider, Contract, parseUnits } from 'ethers';
import { SHOP_WALLET, USDT_ADDRESS } from './config';

const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
];

export async function payWithUSDT(total: string): Promise<string> {
  const eth = (window as any).ethereum;
  if (!eth) throw new Error('MetaMask not found');
  if (!USDT_ADDRESS || !SHOP_WALLET) throw new Error('Token or shop wallet not configured');

  const provider = new BrowserProvider(eth);
  const signer = await provider.getSigner();
  const usdt = new Contract(USDT_ADDRESS, ERC20_ABI, signer);

  const amount = parseUnits(total, 6);
  const tx = await usdt.transfer(SHOP_WALLET, amount);
  await tx.wait();
  return tx.hash;
}