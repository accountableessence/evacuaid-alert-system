import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
dotenv.config();

let db = null;

try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
     const app = initializeApp();
     db = getFirestore(app);
     console.log("🔥 Firebase Admin SDK Successfully Hooked via GOOGLE_APPLICATION_CREDENTIALS");
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
     const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
     const app = initializeApp({ credential: cert(serviceAccount) });
     db = getFirestore(app);
     console.log("🔥 Firebase Admin SDK Successfully Hooked via Custom Key Config");
  } else {
     console.warn("🔥 Firebase Admin config missing. Add Service Account JSON path to server/.env to unlock Real DB.");
  }
} catch (error) {
  console.error("Firebase Admin initialization critically failed:", error.message);
}

export default db;
