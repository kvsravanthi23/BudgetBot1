// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvCcQk7Ae_lVyjlTF_zZZWzkIA7-p0os4",
  authDomain: "budget-bot-1af87.firebaseapp.com",
  projectId: "budget-bot-1af87",
  storageBucket: "budget-bot-1af87.firebasestorage.app",
  messagingSenderId: "889931352738",
  appId: "1:889931352738:web:ba2981b62e5a51892e65fb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth=getAuth(app);

export {app,db,auth};