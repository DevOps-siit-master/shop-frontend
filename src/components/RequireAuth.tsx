import { Navigate, Outlet } from "react-router-dom";
import { isShopOwner } from "../auth";

/** Gates nested routes to a signed-in shop_owner. UI-only — the backend
 * independently enforces this on every request. */
export function RequireAuth() {
  return isShopOwner() ? <Outlet /> : <Navigate to="/login" replace />;
}
