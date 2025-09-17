// app/api/upload/route.js
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { adminStorage } from "@/firebase/firebase";
import * as admin from "firebase-admin";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert File -> Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Unique, safe file name (replace spaces)
    const safeName = (file.name || "upload").replace(/\s+/g, "_");
    const fileName = `images/${uuidv4()}_${safeName}`;

    // Save file to Storage bucket (adminStorage should be your bucket reference)
    const storageFile = adminStorage.file(fileName);
    await storageFile.save(buffer, {
      metadata: { contentType: file.type || "application/octet-stream" },
      resumable: false,
    });

    // Make file public (if you prefer signed URLs, see note below)
    await storageFile.makePublic();

    // Public URL
    const publicUrl = `https://storage.googleapis.com/${adminStorage.name}/${fileName}`;

    // Return only the URL (no Firestore writes)
    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
    });
  } catch (err) {
    console.error("API Upload Error:", err);
    return NextResponse.json(
      { error: err?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
