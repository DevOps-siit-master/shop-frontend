import { API_BASE } from './config';
import type { CartItem } from './types';

export interface OrderResponse {
  id: string;
  status: string;
  total: string;
}

export async function createOrder(items: CartItem[]): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: items.map((i) => ({
        productId: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    }),
  });
  if (!res.ok) {
    throw new Error(`Order failed: ${res.status}`);
  }
  return res.json();
}