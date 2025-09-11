import React, { useState, useEffect,useMemo } from "react";

/**
 * NOTE: This component expects Tailwind CSS to be configured in your project.
 * If you're testing in plain HTML, add the Tailwind CDN script in index.html
 * (not recommended for production).
 */

const mockProducts = [
  { sku: "SKU-001", name: "Wireless Headphones Pro", quantity: 75, price: 129.99 },
  { sku: "SKU-002", name: "4K Ultra HD Monitor", quantity: 30, price: 349.99 },
  { sku: "SKU-003", name: "Ergonomic Office Chair", quantity: 50, price: 249.0 },
  { sku: "SKU-004", name: "Mechanical Keyboard 2.0", quantity: 120, price: 85.5 },
  { sku: "SKU-005", name: "Precision Gaming Mouse", quantity: 95, price: 55.75 },
  { sku: "SKU-006", name: "USB-C Docking Station", quantity: 45, price: 99.99 },
  { sku: "SKU-007", name: "Noise Cancelling Earbuds", quantity: 3, price: 79.99 },
  { sku: "SKU-008", name: "External SSD 1TB", quantity: 1, price: 110.0 },
];

export default function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  // Modal states
  const [isUpdateOpen, setUpdateOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [selectedSku, setSelectedSku] = useState(null);
  const [newStock, setNewStock] = useState("");


  useEffect(() => {    // Fetch products from API (replace with real API call)
    async function fetchProducts() {
      try {     
        const res = await fetch('/api/Products');

        const data = await res.json();
        if (res.ok) {
          setProducts(data.products || []);   
          
        } else {
          console.error('Failed to fetch products:', data.error);
        } 
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    fetchProducts();
  }, []);
  // Filtered list
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return products;
    return products.filter(
      (p) => p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s)
    );
  }, [products, search]);

  // Open update stock modal
  const openUpdate = (sku) => {
    setSelectedSku(sku);
    const p = products.find((x) => x.sku === sku);
    setNewStock(p ? String(p.quantity) : "");
    setUpdateOpen(true);
  };

  const handleUpdateStock = (e) => {
    e.preventDefault();
    const qty = Number(newStock);
    if (isNaN(qty) || qty < 0) {
      alert("Please enter a valid non-negative number for stock.");
      return;
    }
    setProducts((prev) => prev.map((p) => (p.sku === selectedSku ? { ...p, quantity: qty } : p)));
    setUpdateOpen(false);
    setSelectedSku(null);
  };

  // Delete with confirm modal
  const openConfirmDelete = (sku) => {
    setSelectedSku(sku);
    setConfirmOpen(true);
  };

  const handleDelete = () => {
    setProducts((prev) => prev.filter((p) => p.sku !== selectedSku));
    setConfirmOpen(false);
    setSelectedSku(null);
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4 flex justify-center">
      <div className="w-full max-w-6xl">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-800">Product Catalog</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage inventory, update stock counts, and remove products.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-sm text-gray-600">Total items: <span className="font-medium text-gray-800">{products.length}</span></div>
            <button
              onClick={() => {
                // quick demo add (you can replace with real "Add Product" modal integration)
                const seed = Math.floor(Math.random() * 900) + 100;
                const sku = `SKU-${seed}`;
                setProducts((p) => [{ sku, name: `New Product ${seed}`, quantity: 10, price: 49.99 }, ...p]);
              }}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm text-sm"
            >
              + Add Product
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-6">
          <div className="flex gap-3 items-center bg-white border border-gray-200 rounded-md p-2 shadow-sm">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name or SKU..."
              className="flex-1 px-3 py-2 focus:outline-none text-sm"
            />
            <div className="text-xs text-gray-400 pr-2">Press Enter to search</div>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Inventory</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">No products found matching your search.</td>
                  </tr>
                ) : (
                  filtered.map((prod) => {
                    const low = prod.quantity <= 5;
                    return (
                      <tr key={prod.sku} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 align-middle text-sm text-gray-700 font-mono">{prod.sku}</td>

                        <td className="px-6 py-4 align-middle">
                          <div className="text-sm font-medium text-gray-900">{prod.name}</div>
                          <div className="text-xs text-gray-400 mt-1">Category • Example</div>
                        </td>

                        <td className="px-6 py-4 align-middle">
                          <div className="flex items-center gap-3">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${low ? "bg-red-100 text-red-800" : "bg-blue-50 text-blue-800"}`}>
                              {prod.quantity}
                            </div>
                            {low && <div className="text-xs text-red-500">Low stock</div>}
                          </div>
                        </td>

                        <td className="px-6 py-4 align-middle text-sm text-gray-800">{prod.price}</td>

                        <td className="px-6 py-4 align-middle text-right">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => openUpdate(prod.sku)}
                              className="px-3 py-1 text-sm rounded-md bg-white border border-blue-600 text-blue-600 hover:bg-blue-50"
                            >
                              Update Stock
                            </button>

                            <button
                              onClick={() => openConfirmDelete(prod.sku)}
                              className="px-3 py-1 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* UPDATE STOCK MODAL */}
      {isUpdateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setUpdateOpen(false)} />
          <form
            onSubmit={handleUpdateStock}
            className="relative bg-white w-full max-w-md rounded-xl shadow-2xl p-6 z-10"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-800">Update Stock</h3>
                <p className="text-sm text-gray-500">SKU: <span className="font-mono text-gray-700">{selectedSku}</span></p>
              </div>
              <button type="button" className="text-gray-400" onClick={() => setUpdateOpen(false)}>✕</button>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">New stock quantity</label>
              <input
                autoFocus
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                type="number"
                min="0"
                className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setUpdateOpen(false)} className="px-4 py-2 rounded-md bg-white border text-gray-700">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmOpen(false)} />
          <div className="relative bg-white w-full max-w-sm rounded-xl shadow-2xl p-6 z-10">
            <h3 className="text-lg font-semibold text-red-600">Delete product</h3>
            <p className="mt-2 text-sm text-gray-600">Are you sure you want to permanently delete <span className="font-mono">{selectedSku}</span>?</p>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setConfirmOpen(false)} className="px-4 py-2 rounded-md bg-white border text-gray-700">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-md bg-red-600 text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
