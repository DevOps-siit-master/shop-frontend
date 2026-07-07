import { describe, it, expect } from 'vitest';
import { addToCart, changeQty, cartTotal } from './cart';
import type { Product } from './types';

const tshirt: Product = { id: 'p1', name: 'T-shirt', price: '12.50', stock: 20 };
const cap: Product = { id: 'p2', name: 'Cap', price: '9.00', stock: 15 };

describe('cart', () => {
  it('adds a new product with quantity 1', () => {
    expect(addToCart([], tshirt)).toEqual([{ ...tshirt, quantity: 1 }]);
  });

  it('increments quantity when adding an existing product', () => {
    const cart = addToCart([{ ...tshirt, quantity: 1 }], tshirt);
    expect(cart[0].quantity).toBe(2);
  });

  it('removes an item when quantity drops to zero', () => {
    expect(changeQty([{ ...tshirt, quantity: 1 }], 'p1', -1)).toEqual([]);
  });

  it('computes the total across items', () => {
    const cart = [{ ...tshirt, quantity: 2 }, { ...cap, quantity: 1 }];
    expect(cartTotal(cart)).toBe(34);
  });
});