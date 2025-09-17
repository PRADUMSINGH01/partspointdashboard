import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/firebase";

/**
 * DELETE /api/Products/[id]
 * Body or route param must include the product id.
 */
export async function DELETE(req, { params }) {
  try {
    const { id } = await params; // assuming you use dynamic route [id]
    console.log(id, "---server");
    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const docRef = adminDb.collection("Products").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await docRef.delete();

    return NextResponse.json({
      success: true,
      message: `Product with id ${id} deleted successfully`,
    });
  } catch (err) {
    console.error("API Error (Delete Product):", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
