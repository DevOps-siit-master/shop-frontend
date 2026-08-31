import { API_BASE, INVENTORY_API, PAYMENT_API } from "./config";
import type { CartItem, Product } from "./types";

export interface OrderResponse {
  id: string;
  status: string;
  total: string;
}

export async function fetchProducts(search?: string): Promise<Product[]> {
  const qs = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await fetch(`${INVENTORY_API}/products${qs}`);

  if (!res.ok) {
    throw new Error(`Failed to load products ${res.status}`);
  }

  return res.json() as Promise<Product[]>;
}

export async function createOrder(items: CartItem[]): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

export async function verifyPayment(orderId: string, txHash: string) {
  const res = await fetch(`${PAYMENT_API}/payments/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, txHash }),
  });
  if (!res.ok) throw new Error("Payment verification failed");
  return res.json();
}

export type ProductInput = Omit<Product, "id">;

export async function createProduct(input: ProductInput): Promise<Product> {
  const res = await fetch(`${INVENTORY_API}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Failed to create product: ${res.status}`);
  return res.json();
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<Product> {
  const res = await fetch(`${INVENTORY_API}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Failed to update product: ${res.status}`);
  return res.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${INVENTORY_API}/products/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete product: ${res.status}`);
}

export interface PaymentConfig {
  walletAddress: string;
  tokenAddress: string;
  chainId?: number;
}

export async function fetchPaymentConfig(): Promise<PaymentConfig> {
  const res = await fetch(`${PAYMENT_API}/payments/config`);
  if (!res.ok) throw new Error("Failed to fetch payment config");
  return res.json();
}
