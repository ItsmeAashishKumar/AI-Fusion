// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: "aifusion-de953.firebaseapp.com",
  projectId: "aifusion-de953",
  storageBucket: "aifusion-de953.firebasestorage.app",
  messagingSenderId: "548683315993",
  appId: "1:548683315993:web:134f1fe90e35f0f26d2388",
  measurementId: "G-QK75JJT67M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)