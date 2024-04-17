// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUxOmOhHRf4GRFbPfWs9FUh8BSzGHApaM",
  authDomain: "myfirstproject-90335.firebaseapp.com",
  projectId: "myfirstproject-90335",
  storageBucket: "myfirstproject-90335.appspot.com",
  messagingSenderId: "646429322301",
  appId: "1:646429322301:web:1e056365048858990d4e54"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app);
