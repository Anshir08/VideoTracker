// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCUkYVsxDK6G5nw5yWG6jYQLdf14KyHzHI",
  authDomain: "videolectures-31d06.firebaseapp.com",
  projectId: "videolectures-31d06",
  storageBucket: "videolectures-31d06.firebasestorage.app",
  messagingSenderId: "1067695085768",
  appId: "1:1067695085768:web:c224ee9552950b42026dfd",
  measurementId: "G-WGEPBEF552"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
