import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import { AdminOrders } from "./pages/AdminOrders.tsx";
import "./index.css";
import { AdminInventory } from "./pages/AdminInventory.tsx";
import { Login } from "./pages/Login.tsx";
import { RequireAuth } from "./components/RequireAuth.tsx";
import { Nav } from "./components/Nav.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route path="/admin" element={<AdminOrders />} />
          <Route path="/admin/inventory" element={<AdminInventory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
