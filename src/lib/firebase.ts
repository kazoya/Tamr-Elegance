import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBvK41bMZQ9h9VTGvce418HWBKMgKnt42k",
  authDomain: "studio-4644445566-bd545.firebaseapp.com",
  projectId: "studio-4644445566-bd545",
  storageBucket: "studio-4644445566-bd545.firebasestorage.app",
  messagingSenderId: "335347493650",
  appId: "1:335347493650:web:4daefead91b246b8f221cb"
};

// Initialize Firebase (Singleton pattern for Next.js Fast Refresh)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
