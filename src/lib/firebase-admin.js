import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const apps = getApps();
const hasAdminKeys = 
  process.env.FIREBASE_PROJECT_ID && 
  process.env.FIREBASE_CLIENT_EMAIL && 
  process.env.FIREBASE_PRIVATE_KEY;

let app;
if (hasAdminKeys) {
  app = apps.length
    ? apps[0]
    : initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      });
}

export const adminDb = hasAdminKeys 
  ? getFirestore(app) 
  : new Proxy({}, {
      get: (target, prop) => {
        if (prop === 'then') return undefined; // Avoid breaking async/await checks
        return () => {
          throw new Error("Firebase Admin keys are missing in this environment. Cannot access adminDb.");
        };
      }
    });