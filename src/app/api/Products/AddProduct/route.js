import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/firebase";
import admin from "firebase-admin";

export async function POST(req) {
  try {
    const body = await req.json();
    const { sku, name, stock, imageUrl } = body;

    if (!sku || !name || stock === undefined) {
      return NextResponse.json(
        { error: "SKU, Name, and Stock are required" },
        { status: 400 }
      );
    }

    const docRef = await adminDb.collection("Products").add({
      sku,
      name,
      stock: Number(stock),
      imageUrl: imageUrl || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(), // ✅ Correct way
    });

    return NextResponse.json({
      success: true,
      id: docRef.id,
      sku,
      name,
      stock,
    });
  } catch (err) {
    console.error("API Error (Add Product):", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
