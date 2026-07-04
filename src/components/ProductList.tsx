import type { Product } from '../types';

interface Props {
  products: Product[];
  onAdd: (product: Product) => void;
}

export function ProductList({ products, onAdd }: Props) {
  if (products.length === 0) {
    return <p>There are no items.</p>;
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 16,
      }}
    >
      {products.map((p) => (
        <div key={p.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
          <h3>{p.name}</h3>
          <p>{p.price} USDT</p>
          <p style={{ fontSize: 12, color: '#666' }}>In Stock: {p.stock}</p>
          <button onClick={() => onAdd(p)} disabled={p.stock === 0}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}


