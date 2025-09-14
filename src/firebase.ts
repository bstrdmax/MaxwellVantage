import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration object.
// These values are sourced from VITE_ prefixed environment variables,
// which are set in the deployment environment (e.g., Netlify UI)
// and defined in a .env file for local development.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase once with the provided configuration.
const app = initializeApp(firebaseConfig);
// Get a reference to the Firebase Auth service.
const auth = getAuth(app);

// Export the initialized app and auth service for use throughout the application.
export { app, auth };
