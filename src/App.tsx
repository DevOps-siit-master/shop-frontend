import { useMemo, useState } from 'react';
import type { CartItem, Product } from './types';
import { MOCK_PRODUCTS } from './mockProducts';
import { ProductList } from './components/ProductList';
import { Cart } from './components/Cart';
import { createOrder, verifyPayment, type OrderResponse } from './api';
import { useWallet } from './useWallet';
import { payWithUSDT } from './pay';
import { addToCart as addToCartFn, changeQty as changeQtyFn, cartTotal } from './cart';

function App() {
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const { account, error: walletError, connect } = useWallet();
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');

  const products = useMemo(
    () => MOCK_PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const handleCheckout = async () => {
    setError('');
    setTxHash('');
    if (!account) {
      setError('Please connect your wallet first.');
      return;
    }
    try {
      const result = await createOrder(cart);
      setOrder(result);
      const hash = await payWithUSDT(result.total);
      setTxHash(hash);
      const verified = await verifyPayment(result.id, hash);
      setOrder({ ...result, status: verified.status });
      setCart([]);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const addToCart = (product: Product) => setCart((prev) => addToCartFn(prev, product));
  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));
  const changeQuantity = (id: string, delta: number) => setCart((prev) => changeQtyFn(prev, id, delta));
  const total = cartTotal(cart);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>ShopHub Store</h1>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {account ? (
            <span title={account}>
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
          ) : (
            <button onClick={connect}>Connect Wallet</button>
          )}
          <span>🛒 {cartCount}</span>
        </div>
      </header>
      {walletError && <p style={{ color: 'red' }}>{walletError}</p>}

      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '100%', padding: 8, margin: '16px 0' }}
      />

      <ProductList products={products} onAdd={addToCart} />
      <Cart items={cart} onChangeQty={changeQuantity} onRemove={removeFromCart} total={total} />
      {cart.length > 0 && (
        <button onClick={handleCheckout} style={{ marginTop: 16 }}>
          Pay with USDT
        </button>
      )}
      {order && (
        <p style={{ color: 'green' }}>
          Order created! ID: {order.id} · status: {order.status} · total: {order.total} USDT
        </p>
      )}
      {txHash && (
        <p>
          Payment sent!{' '}
          <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer">
            View on Etherscan
          </a>
        </p>
      )}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}

export default App;
