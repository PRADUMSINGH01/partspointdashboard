// lib/uploadToFirebase.js
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

/**
 * Uploads a File (or Blob) to Firebase Storage and returns { url, fileName }.
 * @param {File} file
 * @param {import("firebase/app").FirebaseApp} app Optional: pass your initialized Firebase app
 */
export async function uploadImageToFirebase(file, app) {
  if (!file) throw new Error("No file provided");

  // use the provided app or default app by calling getStorage() without app
  const storage = app ? getStorage(app) : getStorage();

  const safeName = (file.name || "upload").replace(/\s+/g, "_");
  const fileName = `images/${uuidv4()}_${safeName}`;

  const storageRef = ref(storage, fileName);

  // Use uploadBytes for simple one-shot uploads
  const metadata = {
    contentType: file.type || "application/octet-stream",
  };

  await uploadBytes(storageRef, file, metadata);

  // Get a download URL (contains token if not publicly readable)
  const url = await getDownloadURL(storageRef);

  return { success: true, url, fileName };
}
