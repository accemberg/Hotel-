import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize app
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Safe initialization — works in browser + API routes, skips during build/prerender
let db = null;
let auth = null;

try {
  db = getFirestore(app);
} catch (e) {
  // Silently skip during build/prerender
}

try {
  auth = getAuth(app);
} catch (e) {
  // Silently skip during build/prerender
}

export { db, auth };
export default app;