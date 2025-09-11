// app/api/upload/route.js
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { adminDb, adminStorage } from "@/firebase/firebase";
import * as admin from "firebase-admin"; // ✅ needed for FieldValue

/**
 * POST: expects multipart/form-data with field "image"
 * Returns: { success: true, url: "...", fileId: "..." }
 */
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ✅ Convert File -> Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // ✅ Unique file name
    const fileName = `images/${uuidv4()}_${file.name}`;

    // ✅ Save file to Storage
    const storageFile = adminStorage.file(fileName);
    await storageFile.save(buffer, {
      metadata: { contentType: file.type },
      resumable: false,
    });

    // ✅ Make file public (you can use signed URL instead if needed)
    await storageFile.makePublic();

    // ✅ Public URL
    const publicUrl = `https://storage.googleapis.com/${adminStorage.name}/${fileName}`;

    // ✅ Save metadata to Firestore
    const docRef = await adminDb.collection("Products").add({
      name: file.name,
      path: fileName,
      url: publicUrl,
      contentType: file.type || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      fileId: docRef.id,
      url: publicUrl,
    });
  } catch (err) {
    console.error("API Upload Error:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
