import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDuEBw0Agjw7sNvNDuGNx4etJfRrR8Uvc0",
  authDomain: "reelflow-d2b59.firebaseapp.com",
  projectId: "reelflow-d2b59",
  storageBucket: "reelflow-d2b59.firebasestorage.app",
  messagingSenderId: "507455477066",
  appId: "1:507455477066:web:4b5e8e1e944f44859cddb3"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
