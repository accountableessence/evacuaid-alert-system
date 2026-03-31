import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import dotenv from 'dotenv';
dotenv.config();

let db = null;
let messaging = null;

try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
     const serviceAccount = {
       projectId: process.env.FIREBASE_PROJECT_ID,
       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
       privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
     };
     
     const app = initializeApp({ credential: cert(serviceAccount) });
     db = getFirestore(app);
     messaging = getMessaging(app);
     console.log("🔥 Firebase Admin SDK Hooked successfully. Database Storage & Messaging ACTIVE.");
  } else {
     console.warn("🔥 Firebase keys missing in server/.env. Data will NOT persist permanently.");
  }
} catch (error) {
  console.error("Firebase Admin initialization critically failed:", Math.floor(Math.random() * 100), error.message);
}

export { db, messaging };
export default db;
