import type { CartItem } from '../types';

interface Props {
  items: CartItem[];
  onChangeQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  total: number;
}

export function Cart({ items, onChangeQty, onRemove, total }: Props) {
  if (items.length === 0) {
    return <p style={{ marginTop: 24 }}>Cart is empty.</p>;
  }

  return (
    <div style={{ marginTop: 24, borderTop: '1px solid #ddd', paddingTop: 16 }}>
      <h2>Cart</h2>
      {items.map((i) => (
        <div
          key={i.id}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}
        >
          <span>{i.name} - {i.price} USDT</span>
          <span>
            <button onClick={() => onChangeQty(i.id, -1)}>-</button>
            <span style={{ margin: '0 8px' }}>{i.quantity}</span>
            <button onClick={() => onChangeQty(i.id, 1)}>+</button>
            <button onClick={() => onRemove(i.id)} style={{ marginLeft: 12 }}>Remove</button>
          </span>
        </div>
      ))}
      <h3 style={{ textAlign: 'right' }}>Total: {total.toFixed(2)} USDT</h3>
    </div>
  );
}


