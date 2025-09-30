// lib/productsClient.js
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseCli";

/**
 * addProductClient - adds product directly from client to Firestore.
 * @param {Object} product - { name, price, description, category, ... }
 * @param {File|null} imageFile - optional File object to upload to Firebase Storage
 * @returns {Promise<{ ok: boolean, id?: string, error?: string }>}
 */
export async function addProductClient(product) {
  try {
    const docData = {
      ...product,
      createdAt: serverTimestamp(),
    };

    const colRef = collection(db, "Products");
    const docRef = await addDoc(colRef, docData); 

    return { ok: true, id: docRef.id };
  } catch (err) {
    console.error("addProductClient error:", err);
    // Firebase error codes are useful for debugging
    return { ok: false, error: err.message || String(err) };
  }
}
