import { useEffect, useState } from 'react';
import { API_BASE } from '../config';

interface OrderItem { id: string; name: string; price: string; quantity: number; }
interface Order {
  id: string; status: string; total: string;
  txHash?: string; createdAt: string; items: OrderItem[];
}

const th = { textAlign: 'left' as const, borderBottom: '2px solid #ddd', padding: 8 };
const td = { borderBottom: '1px solid #eee', padding: 8 };

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/orders`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load orders');
        return res.json();
      })
      .then(setOrders)
      .catch((e) => setError((e as Error).message));
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>Orders (Admin)</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {orders.length === 0 && !error && <p>No orders yet.</p>}
      {orders.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>Order</th>
              <th style={th}>Status</th>
              <th style={th}>Total</th>
              <th style={th}>Items</th>
              <th style={th}>Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td style={td}>{o.id.slice(0, 8)}…</td>
                <td style={td}>{o.status}</td>
                <td style={td}>{o.total} USDT</td>
                <td style={td}>{o.items.map((i) => `${i.name}×${i.quantity}`).join(', ')}</td>
                <td style={td}>{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


