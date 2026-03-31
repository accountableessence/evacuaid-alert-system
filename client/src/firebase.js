import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "missing_key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "missing_key",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "missing_key",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "missing_key",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "missing_key",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "missing_key"
};

let app;
let db = null;

try {
  // Only attempt to initialize if we plausibly have real keys so the app doesn't fatally crash
  if (firebaseConfig.apiKey !== "missing_key") {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("🔥 Firebase Successfully Hooked In client");
  } else {
    console.warn("🔥 Firebase config missing. Add keys to client/.env.local to activate database features.");
  }
} catch (e) {
  console.error("Firebase initialization failed:", e);
}

export { db, collection, addDoc, onSnapshot, query, where };
