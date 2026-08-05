import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB2qHbKHUq0PVwNCSKCwwqfQygQSsCYFmk",
  authDomain: "edunext-learning-platform.firebaseapp.com",
  projectId: "edunext-learning-platform",
  storageBucket: "edunext-learning-platform.firebasestorage.app",
  messagingSenderId: "82274048841",
  appId: "1:82274048841:web:1ed72dff9c7b7fc2a39898",
  measurementId: "G-2KJ8NYRBBV",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
