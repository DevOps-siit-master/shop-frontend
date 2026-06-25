import { useMemo, useState } from 'react';
import type { CartItem, Product } from './types';
import { MOCK_PRODUCTS } from './mockProducts';
import { ProductList } from './components/ProductList';
import { Cart } from './components/Cart';

function App() {
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

  const products = useMemo(
    () => MOCK_PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

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
        <span>🛒 {cartCount}</span>
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
    </div>
  );
}

export default App;


