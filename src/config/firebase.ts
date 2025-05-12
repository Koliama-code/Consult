import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAEg4WYiTzJAyZzWj-IzwEbZE6Il2BaR2U",
  authDomain: "authentification-26645.firebaseapp.com",
  projectId: "authentification-26645",
  storageBucket: "authentification-26645.firebasestorage.app",
  messagingSenderId: "214764317131",
  appId: "1:214764317131:web:2b2f2d199e7aadd9c6ee4e",
  measurementId: "G-B534JXYMPZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);

// Export default app for convenience
export default app;