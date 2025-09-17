import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/firebase";
import admin from "firebase-admin";

export async function POST(req) {
  try {
    const body = await req.json();

    // Accept both old `name` and new `title` fields
    const {
      sku,
      name,       // legacy
      title,      // new
      brandName,
      model,
      category,
      subcategory,
      description,
      mrp,
      discountedPrice,
      stock,
      images,
      compatibility,
      isNew,
      date, // optional publish date (yyyy-mm-dd)
      // any other fields will be ignored unless added below
    } = body;

    const productTitle = (title || name || "").toString().trim();

    // Required validation
    if (!sku || !productTitle || stock === undefined || stock === null || stock === "") {
      return NextResponse.json(
        { error: "SKU, Title/Name and Stock are required" },
        { status: 400 }
      );
    }

    // Optional uniqueness check for SKU (returns 409 if already exists)
    const existing = await adminDb
      .collection("Products")
      .where("sku", "==", sku)
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json(
        { error: "A product with this SKU already exists" },
        { status: 409 }
      );
    }

    // Normalize numeric fields
    const normalizedStock = Number(stock);
    const normalizedMrp = mrp === "" || mrp === null || mrp === undefined ? null : Number(mrp);
    const normalizedDiscounted = discountedPrice === "" || discountedPrice === null || discountedPrice === undefined
      ? null
      : Number(discountedPrice);

    // Normalize images array (expecting an array of URLs, keep up to 2)
    const imagesArr = Array.isArray(images) ? images.slice(0, 2) : [];

    // Normalize compatibility array (ensure it's an array of objects)
    const compatibilityArr = Array.isArray(compatibility)
      ? compatibility.map((c) => ({
          brand: c?.brand ?? "",
          model: c?.model ?? "",
          year: c?.year ?? "",
          engine: c?.engine ?? "",
        }))
      : [];

    // Parse publish date if provided
    let publishDate = null;
    if (date) {
      const d = new Date(date);
      if (!Number.isNaN(d.getTime())) {
        publishDate = admin.firestore.Timestamp.fromDate(d);
      }
    }

    // Prepare document data
    const docData = {
      sku: sku.toString(),
      title: productTitle,
      brandName: brandName || null,
      model: model || null,
      category: category || null,
      subcategory: subcategory || null,
      description: description || null,
      mrp: normalizedMrp,
      discountedPrice: normalizedDiscounted,
      stock: Number.isFinite(normalizedStock) ? normalizedStock : 0,
      images: imagesArr,
      compatibility: compatibilityArr,
      isNew: Boolean(isNew),
      publishDate: publishDate, // may be null
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection("Products").add(docData);

    // return created product meta (won't contain serverTimestamp values expanded)
    return NextResponse.json({
      success: true,
      id: docRef.id,
      product: { id: docRef.id, ...docData },
    });
  } catch (err) {
    console.error("API Error (Add Product):", err);
    return NextResponse.json({ error: err.message || "Internal Error" }, { status: 500 });
  }
}
