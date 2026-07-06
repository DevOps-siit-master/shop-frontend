import type { CartItem, Product } from './types';

export function addToCart(cart: CartItem[], product: Product): CartItem[] {
  const existing = cart.find((i) => i.id === product.id);
  if (existing) {
    return cart.map((i) =>
      i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
    );
  }
  return [...cart, { ...product, quantity: 1 }];
}

export function changeQty(cart: CartItem[], id: string, delta: number): CartItem[] {
  return cart
    .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
    .filter((i) => i.quantity > 0);
}

export function cartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
}