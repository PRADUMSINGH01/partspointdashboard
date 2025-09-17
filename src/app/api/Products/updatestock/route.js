// app/api/Products/stock/route.js
import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/firebase";
import admin from "firebase-admin";

/**
 * PATCH /api/Products/stock
 * Body: { id?, sku?, op: 'increment'|'decrement'|'set', amount: number }
 */
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, sku, op = "increment", amount } = body;

    if ((id && typeof id !== "string") || (sku && typeof sku !== "string")) {
      return NextResponse.json({ error: "Invalid id or sku" }, { status: 400 });
    }

    if (op !== "increment" && op !== "decrement" && op !== "set") {
      return NextResponse.json(
        { error: "Invalid op. Use 'increment'|'decrement'|'set'." },
        { status: 400 }
      );
    }

    if (typeof amount !== "number" || Number.isNaN(amount)) {
      return NextResponse.json(
        { error: "amount must be a number" },
        { status: 400 }
      );
    }

    // find the docRef either by id or by sku
    let docRef;
    if (id) {
      docRef = adminDb.collection("Products").doc(id);
    } else if (sku) {
      const q = await adminDb
        .collection("Products")
        .where("sku", "==", sku)
        .limit(1)
        .get();
      if (q.empty)
        return NextResponse.json(
          { error: "Product not found for provided sku" },
          { status: 404 }
        );
      docRef = q.docs[0].ref;
    } else {
      return NextResponse.json(
        { error: "Provide either 'id' or 'sku' in the request body" },
        { status: 400 }
      );
    }

    // Run transaction to avoid race conditions
    const newStock = await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(docRef);
      if (!snap.exists) throw new Error("Product not found");

      const cur = Number(snap.data()?.stock ?? 0);
      if (!Number.isFinite(cur)) throw new Error("Current stock is invalid");

      let result;
      if (op === "set") {
        if (amount < 0) throw new Error("stock cannot be negative");
        result = Math.floor(amount);
      } else if (op === "increment") {
        result = cur + Math.floor(amount);
      } else if (op === "decrement") {
        result = cur - Math.floor(amount);
      }

      if (!Number.isFinite(result))
        throw new Error("Computed stock is invalid");

      if (result < 0) {
        // Prevent negative stock — change behavior here if you prefer clamping to 0
        throw new Error("Operation would result in negative stock");
      }

      tx.update(docRef, {
        stock: result,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return result;
    });

    return NextResponse.json({
      success: true,
      id: docRef.id,
      stock: newStock,
    });
  } catch (err) {
    console.error("API Error (update stock):", err);
    const msg = err?.message || "Internal Error";
    // map known error messages -> 400
    const bad = [
      "Product not found",
      "stock cannot be negative",
      "Operation would result in negative stock",
      "Computed stock is invalid",
      "Current stock is invalid",
    ].includes(msg);
    return NextResponse.json({ error: msg }, { status: bad ? 400 : 500 });
  }
}
