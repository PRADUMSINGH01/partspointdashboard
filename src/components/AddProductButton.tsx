"use client";

import React, { useState } from "react";
import { FiX, FiUpload, FiImage } from "react-icons/fi";

type ProductForm = {
  sku: string;
  name: string;
  imageUrl: string;
  stock: number | "";
  date: string;
};

type Props = {
  onSave?: (data: ProductForm) => Promise<void> | void;
};

export default function AddProductModal({ onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ProductForm>({
    sku: "",
    name: "",
    imageUrl: "",
    stock: "",
    date: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === "stock" ? (value === "" ? "" : Number(value)) : value } as ProductForm));
  };

  const reset = () =>
    setForm({ sku: "", name: "", imageUrl: "", stock: "", date: "" });

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    // basic validation
    if (!form.sku.trim() || !form.name.trim() || form.stock === "") {
      alert("Please fill SKU, Name and Stock.");
      return;
    }

    try {
      setLoading(true);
      if (onSave) await onSave(form);
      else console.log("Save product ->", form);
      setOpen(false);
      reset();
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const previewImageValid = form.imageUrl && form.imageUrl.startsWith("http");

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 text-white font-semibold shadow-md hover:from-blue-700 hover:to-blue-600"
      >
        <FiUpload />
        Add Products
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          <div
            className="relative w-[95%] max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
            role="dialog"
            aria-modal="true"
            aria-label="Add new product"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow">
                  <FiImage className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-700">Add New Product</h3>
                  <p className="text-sm text-gray-500">Add SKU, images, stock & publish date</p>
                </div>
              </div>

              <button
                className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
                onClick={() => setOpen(false)}
                aria-label="Close modal"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {/* LEFT: Preview */}
              <div className="flex flex-col gap-4">
                <div className="flex-1 border border-gray-100 rounded-lg p-4 flex items-center justify-center bg-white">
                  {previewImageValid ? (
                    // image preview
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.imageUrl}
                      alt={form.name || form.sku || "preview"}
                      className="max-h-64 object-contain rounded-md"
                      onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                    />
                  ) : (
                    <div className="text-center text-gray-300">
                      <FiImage size={48} />
                      <p className="mt-2 text-sm">Image preview</p>
                      <p className="mt-1 text-xs">Add a valid image URL to preview</p>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Live preview</p>
                  <h4 className="mt-1 font-semibold text-blue-800 truncate">{form.name || "Product name"}</h4>
                  <p className="text-sm text-gray-600">SKU: <span className="font-medium text-gray-800">{form.sku || "-"}</span></p>
                  <p className="text-sm text-gray-600">Stock: <span className="font-medium text-gray-800">{form.stock === "" ? "-" : form.stock}</span></p>
                  <p className="text-sm text-gray-600">Date: <span className="font-medium text-gray-800">{form.date || "-"}</span></p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-lg border border-blue-600 text-blue-600 font-medium hover:bg-blue-50"
                    onClick={() => {
                      // quick fill example (useful for demo)
                      setForm({ sku: "SKU-001", name: "Sample Model X", imageUrl: "", stock: 10, date: "" });
                    }}
                  >
                    Quick Fill
                  </button>

                  <button
                    type="button"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      navigator.clipboard && form.imageUrl ? navigator.clipboard.writeText(form.imageUrl) : null;
                      alert(form.imageUrl ? "Image URL copied" : "No image URL to copy");
                    }}
                  >
                    Copy Image URL
                  </button>
                </div>
              </div>

              {/* RIGHT: Form */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product SKU</label>
                  <input
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    placeholder="e.g. SKU-12345"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Honda Civic 2025"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    placeholder="https://.../image.jpg"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      name="stock"
                      type="number"
                      min={0}
                      value={form.stock as any}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                <div className="mt-auto flex gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex-1 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    onClick={(e) => handleSubmit(e as any)}
                    disabled={loading}
                    className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 disabled:opacity-60"
                  >
                    {loading ? "Saving..." : "Save Product"}
                  </button>
                </div>

                <p className="text-xs text-gray-400 mt-2">* Fields SKU, Name and Stock are required.</p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
