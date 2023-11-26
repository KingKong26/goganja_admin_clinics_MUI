// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbeVQw2MlQOSE-97UyMx7IJKiSgvVqYYY",
  authDomain: "crud-b15f0.firebaseapp.com",
  projectId: "crud-b15f0",
  storageBucket: "crud-b15f0.appspot.com",
  messagingSenderId: "286952407725",
  appId: "1:286952407725:web:b225d47ef9b394479b3c24",
  measurementId: "G-1MDC27LYW2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

