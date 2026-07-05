import { useEffect, useMemo, useState } from 'react';
import type { CartItem, Product } from './types';
import { MOCK_PRODUCTS } from './mockProducts';
import { ProductList } from './components/ProductList';
import { Cart } from './components/Cart';
import { AuthForm } from './components/AuthForm';
import { me, refresh, tokenStore, type AuthUser } from './authApi';
import { createOrder, type OrderResponse } from './api';

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [error, setError] = useState('');

  // On load, restore the session from stored tokens (refreshing if the access
  // token has expired).
  useEffect(() => {
    const restore = async () => {
      const access = tokenStore.access;
      if (!access) {
        setAuthChecked(true);
        return;
      }
      try {
        setUser(await me(access));
      } catch {
        const rt = tokenStore.refresh;
        try {
          if (!rt) throw new Error('no refresh token');
          const tokens = await refresh(rt);
          tokenStore.save(tokens);
          setUser(await me(tokens.accessToken));
        } catch {
          tokenStore.clear();
        }
      } finally {
        setAuthChecked(true);
      }
    };
    void restore();
  }, []);

  const logout = () => {
    tokenStore.clear();
    setUser(null);
    setCart([]);
    setOrder(null);
  };

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

  if (!authChecked) {
    return <p style={{ textAlign: 'center', marginTop: '10vh' }}>Loading…</p>;
  }

  if (!user) {
    return <AuthForm onAuthenticated={setUser} />;
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>ShopHub Store</h1>
        <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>🛒 {cartCount}</span>
          <span style={{ color: '#888' }}>{user.email}</span>
          <button onClick={logout}>Log out</button>
        </span>
      </header>

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


