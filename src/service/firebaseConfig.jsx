// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_0KJ55xca1cntTEQr6wUexscIzF_9kdo",
  authDomain: "minor-project-75eff.firebaseapp.com",
  projectId: "minor-project-75eff",
  storageBucket: "minor-project-75eff.firebasestorage.app",
  messagingSenderId: "739242957463",
  appId: "1:739242957463:web:1d845d83bf69af527967d2",
  measurementId: "G-VVKJ8N9V4M"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
// const analytics = getAnalytics(app);