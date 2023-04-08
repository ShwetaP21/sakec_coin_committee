import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { getAuth } from "firebase/auth";
import 'firebase/compat/auth';



const firebaseConfig = {
  apiKey: "AIzaSyCG6W4bLhaZxun8Ul8_gjmeaCQtjPlK87o",
  authDomain: "sakec-coin.firebaseapp.com",
  projectId: "sakec-coin",
  storageBucket: "sakec-coin.appspot.com",
  messagingSenderId: "125934512447",
  appId: "1:125934512447:web:cf02f521049c8c83cbcb8a",
  measurementId: "G-PG98BY6VDY"
};

// Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig);
export const db = app.firestore();
export const auth = getAuth(app);
export const authGenerate = firebase.auth();
