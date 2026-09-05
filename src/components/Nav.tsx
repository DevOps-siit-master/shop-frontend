import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../auth";

export function Nav() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      style={{
        padding: 12,
        borderBottom: "1px solid #eee",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Link to="/">Store</Link> {" | "} <Link to="/admin">Admin</Link>{" "}
        {" | "} <Link to="/admin/inventory">Inventory</Link>
      </div>
      {user ? (
        <button onClick={handleLogout}>Log out</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
