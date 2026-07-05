import { useMemo, useState } from 'react';
import type { CartItem, Product } from './types';
import { MOCK_PRODUCTS } from './mockProducts';
import { ProductList } from './components/ProductList';
import { Cart } from './components/Cart';
import { createOrder, type OrderResponse } from './api';
import { useWallet } from './useWallet';

function App() {
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const { account, error: walletError, connect } = useWallet();
  const [error, setError] = useState('');

  const products = useMemo(
    () => MOCK_PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const handleCheckout = async () => {
    setError('');
    try {
      const result = await createOrder(cart);
      setOrder(result);
      setCart([]);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => 
    setCart((prev) => prev.filter((i) => i.id !== id));

  const changeQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0),
    );
  }

  const total = cart.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
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
          Create Order
        </button>
      )}
      {order && (
        <p style={{ color: 'green' }}>
          ✅ Order created! ID: {order.id} · status: {order.status} · total: {order.total} USDT
        </p>
      )}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}

export default App;


