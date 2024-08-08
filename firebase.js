// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMBYjqOy5nYGlHsFzRFLaBz_YUWbVmSnc",
  authDomain: "inventory-management-afe54.firebaseapp.com",
  projectId: "inventory-management-afe54",
  storageBucket: "inventory-management-afe54.appspot.com",
  messagingSenderId: "1052189495646",
  appId: "1:1052189495646:web:0b9023d6e09adc9889ffcf",
  measurementId: "G-J5EQ3PYMXJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}