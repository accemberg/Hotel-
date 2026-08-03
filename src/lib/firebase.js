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

let _app;
let _db;
let _auth;

function getAppInstance() {
  if (!_app) {
    _app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return _app;
}

// Lazy Firestore Proxy
export const db = new Proxy({}, {
  get: (target, prop) => {
    if (!_db) {
      _db = getFirestore(getAppInstance());
    }
    const val = Reflect.get(_db, prop);
    return typeof val === "function" ? val.bind(_db) : val;
  },
  set: (target, prop, val) => {
    if (!_db) {
      _db = getFirestore(getAppInstance());
    }
    return Reflect.set(_db, prop, val);
  }
});

// Lazy Auth Proxy
export const auth = new Proxy({}, {
  get: (target, prop) => {
    if (!_auth) {
      _auth = getAuth(getAppInstance());
    }
    const val = Reflect.get(_auth, prop);
    return typeof val === "function" ? val.bind(_auth) : val;
  },
  set: (target, prop, val) => {
    if (!_auth) {
      _auth = getAuth(getAppInstance());
    }
    return Reflect.set(_auth, prop, val);
  }
});

export default getAppInstance;