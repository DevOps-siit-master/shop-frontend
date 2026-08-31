import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
  type ProductInput,
} from "../api";
import { useEffect, useState } from "react";
import type { Product } from "../types";

interface Draft {
  name: string;
  price: string;
  stock: string;
}

const th = {
  textAlign: "left" as const,
  borderBottom: "2px solid #ddd",
  padding: 8,
};
const td = { borderBottom: "1px solid #eee", padding: 8 };
const input = { padding: 8, width: "100%", boxSizing: "border-box" as const };

const emptyDraft: Draft = { name: "", price: "", stock: "" };
function validate(d: Draft): string | null {
  if (!d.name.trim()) return "Name is required.";
  if (!/^\d+(\.\d{1,2})?$/.test(d.price.trim()))
    return "Price must be a number like 12.50.";
  if (!/^\d+$/.test(d.stock.trim())) return "Stock must be a whole number.";
  return null;
}

function toInput(d: Draft): ProductInput {
  return { name: d.name.trim(), price: d.price.trim(), stock: Number(d.stock) };
}

export function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [newDraft, setNewDraft] = useState<Draft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Draft>(emptyDraft);

  const load = () => {
    fetchProducts()
      .then((p) => {
        setProducts(p);
        setError("");
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleAdd = async () => {
    const problem = validate(newDraft);
    if (problem) {
      setError(problem);
      return;
    }
    setBusy(true);
    try {
      const created = await createProduct(toInput(newDraft));
      setProducts((prev) => [...prev, created]);
      setNewDraft(emptyDraft);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditDraft({ name: p.name, price: p.price, stock: String(p.stock) });
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft(emptyDraft);
  };

  const saveEdit = async (id: string) => {
    const problem = validate(editDraft);
    if (problem) {
      setError(problem);
      return;
    }
    setBusy(true);
    try {
      const updated = await updateProduct(id, toInput(editDraft));
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      cancelEdit();
      setError("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (p: Product) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await deleteProduct(p.id);
      setProducts((prev) => prev.filter((x) => x.id !== p.id));
      setError("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Inventory (Admin)</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2 style={{ fontSize: 18, marginTop: 24 }}>Add a product</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr auto",
          gap: 8,
          alignItems: "end",
          marginBottom: 24,
        }}
      >
        <label>
          Name
          <input
            style={input}
            value={newDraft.name}
            onChange={(e) => setNewDraft({ ...newDraft, name: e.target.value })}
            placeholder="T-shirt"
          />
        </label>
        <label>
          Price (USDT)
          <input
            style={input}
            value={newDraft.price}
            onChange={(e) =>
              setNewDraft({ ...newDraft, price: e.target.value })
            }
            placeholder="12.50"
            inputMode="decimal"
          />
        </label>
        <label>
          Stock
          <input
            style={input}
            type="number"
            min={0}
            value={newDraft.stock}
            onChange={(e) =>
              setNewDraft({ ...newDraft, stock: e.target.value })
            }
            placeholder="20"
          />
        </label>
        <button onClick={handleAdd} disabled={busy}>
          Add
        </button>
      </div>

      {loading && <p>Loading…</p>}
      {!loading && products.length === 0 && !error && (
        <p>No products yet. Add your first one above.</p>
      )}
      {!loading && products.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Price (USDT)</th>
              <th style={th}>Stock</th>
              <th style={{ ...th, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) =>
              editingId === p.id ? (
                <tr key={p.id}>
                  <td style={td}>
                    <input
                      style={input}
                      value={editDraft.name}
                      onChange={(e) =>
                        setEditDraft({ ...editDraft, name: e.target.value })
                      }
                    />
                  </td>
                  <td style={td}>
                    <input
                      style={input}
                      value={editDraft.price}
                      onChange={(e) =>
                        setEditDraft({ ...editDraft, price: e.target.value })
                      }
                      inputMode="decimal"
                    />
                  </td>
                  <td style={td}>
                    <input
                      style={input}
                      type="number"
                      min={0}
                      value={editDraft.stock}
                      onChange={(e) =>
                        setEditDraft({ ...editDraft, stock: e.target.value })
                      }
                    />
                  </td>
                  <td
                    style={{ ...td, textAlign: "right", whiteSpace: "nowrap" }}
                  >
                    <button onClick={() => saveEdit(p.id)} disabled={busy}>
                      Save
                    </button>{" "}
                    <button onClick={cancelEdit} disabled={busy}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={p.id}>
                  <td style={td}>{p.name}</td>
                  <td style={td}>{p.price}</td>
                  <td
                    style={{ ...td, color: p.stock === 0 ? "red" : undefined }}
                  >
                    {p.stock}
                  </td>
                  <td
                    style={{ ...td, textAlign: "right", whiteSpace: "nowrap" }}
                  >
                    <button onClick={() => startEdit(p)} disabled={busy}>
                      Edit
                    </button>{" "}
                    <button onClick={() => handleDelete(p)} disabled={busy}>
                      Delete
                    </button>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
