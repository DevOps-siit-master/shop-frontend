import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import App from './App.tsx';
import { AdminOrders } from './pages/AdminOrders.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <nav style={{ padding: 12, borderBottom: '1px solid #eee' }}>
        <Link to="/">Store</Link> {' | '} <Link to="/admin">Admin</Link>
      </nav>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminOrders />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);