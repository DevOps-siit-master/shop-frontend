export const API_BASE = import.meta.env.VITE_ORDER_API ?? 'http://localhost:3000';

// Auth service base. Defaults to '/auth-api', which Vite proxies to the auth
// service (see vite.config.ts) so the browser stays same-origin and there are
// no CORS issues in development.
export const AUTH_BASE = import.meta.env.VITE_AUTH_API ?? '/auth-api';

export const USDT_ADDRESS = import.meta.env.VITE_USDT_ADDRESS ?? '';
export const SHOP_WALLET = import.meta.env.VITE_SHOP_WALLET ?? '';
export const PAYMENT_API = import.meta.env.VITE_PAYMENT_API ?? 'http://localhost:3001';
