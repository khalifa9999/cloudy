import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCn1fWXX6Ns78W3EVuXVQ0eqaMI-dzq68o",
  authDomain: "atv-auto.firebaseapp.com",
  projectId: "atv-auto",
  storageBucket: "atv-auto.firebasestorage.app",
  messagingSenderId: "510785610697",
  appId: "1:510785610697:web:e1ee5006363b7261ba7e18",
  measurementId: "G-RN6NFXCQRH"
};

// Prevent re-initialization in Next.js hot reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; 