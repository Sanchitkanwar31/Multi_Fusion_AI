// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "november25-a5f96.firebaseapp.com",
  projectId: "november25-a5f96",
  storageBucket: "november25-a5f96.firebasestorage.app",
  messagingSenderId: "325299645009",
  appId: "1:325299645009:web:0afdf4e9d2ab0f53d62670",
  measurementId: "G-348E1M79H9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Export both so they can be imported elsewhere
export { db, app };

