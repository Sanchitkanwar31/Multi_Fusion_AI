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
  authDomain: process.env.authDomain_key,
  projectId: process.env.projectId_key,
  storageBucket: process.env.storageBucket_key,
  messagingSenderId: process.env.messagingSenderId_key,
  appId: process.env.appId_key,
  measurementId: process.env.measurementId_key
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Export both so they can be imported elsewhere
export { db, app };

