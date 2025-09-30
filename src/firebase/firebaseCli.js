import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Import the functions you need from the SDKs you need

// Your web app's Firebase configuration
// Replace these values with your actual Firebase config values
const firebaseConfig = {
    // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    // appId: process.env.REACT_APP_FIREBASE_APP_ID
    apiKey: "AIzaSyCAiQMxcGvlk4hVh8pSEdj6lffmvVHcK2k",
    authDomain: "part-71b9a.firebaseapp.com",
    projectId: "part-71b9a",
    storageBucket: "part-71b9a.firebasestorage.app",
    messagingSenderId: "808005958698",
    appId: "1:808005958698:web:ade259d5d71f1114bfd753",
    measurementId: "G-41TM9JLL47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export the services
export { auth, db, storage };