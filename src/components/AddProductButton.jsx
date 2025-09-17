"use client";

import React, { useState, useRef } from "react";
import { FiX, FiUpload, FiImage } from "react-icons/fi";

export default function AddProductModal({ onSave }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);

  const [form, setForm] = useState({
    sku: "",
    title: "",
    brandName: "",
    model: "",
    category: "",
    subcategory: "",
    description: "",
    mrp: "",
    discountedPrice: "",
    stock: "",
    date: "",
    images: ["", ""], // two images
    compatibility: [
      { brand: "", model: "", year: "", engine: "" },
    ],
    isNew: false,
  });

  const reset = () =>
    setForm({
      sku: "",
      title: "",
      brandName: "",
      model: "",
      category: "",
      subcategory: "",
      description: "",
      mrp: "",
      discountedPrice: "",
      stock: "",
      date: "",
      images: ["", ""],
      compatibility: [{ brand: "", model: "", year: "", engine: "" }],
      isNew: false,
    });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "isNew") {
      setForm((p) => ({ ...p, isNew: checked }));
      return;
    }

    // numeric fields
    if (name === "stock" || name === "mrp" || name === "discountedPrice") {
      setForm((p) => ({ ...p, [name]: value === "" ? "" : Number(value) }));
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  // compatibility handlers
  const addCompatibility = () =>
    setForm((p) => ({
      ...p,
      compatibility: [...p.compatibility, { brand: "", model: "", year: "", engine: "" }],
    }));

  const removeCompatibility = (idx) =>
    setForm((p) => ({
      ...p,
      compatibility: p.compatibility.filter((_, i) => i !== idx),
    }));

  const handleCompatibilityChange = (idx, field, value) =>
    setForm((p) => ({
      ...p,
      compatibility: p.compatibility.map((c, i) => (i === idx ? { ...c, [field]: value } : c)),
    }));

  // Upload function (single upload function for both images)
  async function uploadImage(file, index) {
    try {
      setUploadingIndex(index);

      const fd = new FormData();
      fd.append("image", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Upload failed");

      setForm((p) => {
        const images = [...p.images];
        images[index] = json.url;
        return { ...p, images };
      });

      return json;
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Image upload failed: " + err.message);
      return null;
    } finally {
      setUploadingIndex(null);
    }
  }

  const onPickFile = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadImage(file, index);
    e.target.value = "";
  };

  const triggerFilePicker = (index) => {
    if (index === 0) fileInputRef1.current?.click();
    if (index === 1) fileInputRef2.current?.click();
  };

  const validateRequired = () => {
    if (!form.sku?.toString().trim() || !form.title?.toString().trim() || form.stock === "") {
      alert("Please fill SKU, Title and Stock.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateRequired()) return;

    try {
      setLoading(true);

      const payload = { ...form };

      const res = await fetch("/api/Products/AddProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to add product");

      console.log("✅ Product added:", data);
      alert("Product added successfully!");
      setOpen(false);
      reset();
      onSave && onSave(data);
    } catch (err) {
      console.error("❌ API Error:", err);
      alert("Failed to save product: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const previewImageValid = (url) => url && url.startsWith("http");

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
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          <div
            className="relative w-[95%] max-w-5xl bg-white rounded-2xl shadow-2xl overflow-auto border border-gray-100 max-h-[90vh]"
            role="dialog"
            aria-modal="true"
            aria-label="Add new product"
          >
            <div className="flex items-center justify-between px-6 py-4 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow">
                  <FiImage className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-700">Add New Product</h3>
                  <p className="text-sm text-gray-500">Add SKU, images, stock & details</p>
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

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* LEFT: Image previews + upload */}
              <div className="flex flex-col gap-4 lg:col-span-1">
                <div className="grid grid-cols-2 gap-3">
                  {[0, 1].map((i) => (
                    <div key={i} className="border border-gray-100 rounded-lg p-3 flex flex-col items-center">
                      <div className="w-full h-40 flex items-center justify-center bg-white">
                        {previewImageValid(form.images[i]) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={form.images[i]} alt={`img-${i}`} className="max-h-36 object-contain rounded-md" onError={(e)=> (e.target.style.display = 'none')} />
                        ) : (
                          <div className="text-center text-gray-300">
                            <FiImage size={36} />
                            <p className="mt-2 text-sm">Image {i + 1}</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 w-full flex gap-2">
                        <input ref={i===0?fileInputRef1:fileInputRef2} type="file" accept="image/*" className="hidden" onChange={(e)=>onPickFile(e,i)} />

                        <button type="button" onClick={()=>triggerFilePicker(i)} className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50">
                          <FiUpload />
                          {uploadingIndex === i ? "Uploading..." : "Upload"}
                        </button>

                        <button type="button" className="px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50" onClick={()=> setForm(p=>{ const images = [...p.images]; images[i] = ''; return {...p, images}; })}>
                          Remove
                        </button>
                      </div>

                      <div className="text-sm text-gray-600 mt-2 truncate w-full text-center">{form.images[i] ? form.images[i] : "No image"}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Live preview</p>
                  <h4 className="mt-1 font-semibold text-blue-800 truncate">{form.title || "Product title"}</h4>
                  <p className="text-sm text-gray-600">SKU: <span className="font-medium text-gray-800">{form.sku || "-"}</span></p>
                  <p className="text-sm text-gray-600">Brand: <span className="font-medium text-gray-800">{form.brandName || "-"}</span></p>
                  <p className="text-sm text-gray-600">Stock: <span className="font-medium text-gray-800">{form.stock === "" ? "-" : form.stock}</span></p>
                </div>

                <div className="flex gap-3">
                  <button type="button" className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-lg border border-blue-600 text-blue-600 font-medium hover:bg-blue-50" onClick={()=>{
                    setForm({
                      sku: "SKU-001",
                      title: "Sample Model X",
                      brandName: "GenericBrand",
                      model: "Model X",
                      category: "Motor",
                      subcategory: "Engine",
                      description: "Sample description",
                      mrp: 19999,
                      discountedPrice: 15999,
                      stock: 10,
                      date: "",
                      images: ["",""],
                      compatibility: [{brand:"GenericBrand", model:"Model X", year:2020, engine:"1.5L"}],
                      isNew: true,
                    })
                  }}>
                    Quick Fill
                  </button>

                  <button type="button" className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50" onClick={()=>{ navigator.clipboard && form.images[0] ? navigator.clipboard.writeText(form.images[0]) : null; alert(form.images[0] ? "Image URL copied" : "No image URL to copy") }}>
                    Copy Image 1 URL
                  </button>
                </div>
              </div>

              {/* RIGHT: Form */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product SKU</label>
                    <input name="sku" value={form.sku} onChange={handleChange} placeholder="e.g. SKU-12345" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Honda Civic 2025" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                    <input name="brandName" value={form.brandName} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input name="model" value={form.model} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2" />
                  </div>

                  <div className="flex items-end">
                    <label className="w-full text-sm font-medium text-gray-700 mb-1">Is New?</label>
                    <div className="flex items-center ml-3">
                      <input type="checkbox" name="isNew" checked={form.isNew} onChange={handleChange} className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input name="category" value={form.category} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                    <input name="subcategory" value={form.subcategory} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">MRP</label>
                    <input name="mrp" type="number" min={0} value={form.mrp} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price</label>
                    <input name="discountedPrice" type="number" min={0} value={form.discountedPrice} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input name="stock" type="number" min={0} value={form.stock} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                    <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU (again)</label>
                    <input name="sku" value={form.sku} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2" />
                  </div>
                </div>

                {/* Compatibility list */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700">Compatibility</h4>
                    <button type="button" onClick={addCompatibility} className="text-sm text-blue-600">+ Add</button>
                  </div>

                  <div className="space-y-2">
                    {form.compatibility.map((c, idx) => (
                      <div key={idx} className="grid grid-cols-4 gap-2 items-end">
                        <div>
                          <label className="block text-xs text-gray-500">Brand</label>
                          <input value={c.brand} onChange={(e)=>handleCompatibilityChange(idx,'brand',e.target.value)} className="w-full border border-gray-200 rounded px-2 py-1 text-sm" />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-500">Model</label>
                          <input value={c.model} onChange={(e)=>handleCompatibilityChange(idx,'model',e.target.value)} className="w-full border border-gray-200 rounded px-2 py-1 text-sm" />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-500">Year</label>
                          <input value={c.year} onChange={(e)=>handleCompatibilityChange(idx,'year',e.target.value)} className="w-full border border-gray-200 rounded px-2 py-1 text-sm" />
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500">Engine</label>
                            <input value={c.engine} onChange={(e)=>handleCompatibilityChange(idx,'engine',e.target.value)} className="w-full border border-gray-200 rounded px-2 py-1 text-sm" />
                          </div>

                          <button type="button" onClick={()=>removeCompatibility(idx)} className="text-red-500 text-sm">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button type="button" onClick={()=>setOpen(false)} className="flex-1 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</button>

                  <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 disabled:opacity-60">{loading? 'Saving...':'Save Product'}</button>
                </div>

                <p className="text-xs text-gray-400 mt-2">* Fields SKU, Title and Stock are required. Upload images before saving for best results.</p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
