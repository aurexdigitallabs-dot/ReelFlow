import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDuEBw0Agjw7sNvNDuGNx4etJfRrR8Uvc0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "reelflow-d2b59.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "reelflow-d2b59",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "reelflow-d2b59.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "507455477066",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:507455477066:web:4b5e8e1e944f44859cddb3"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
