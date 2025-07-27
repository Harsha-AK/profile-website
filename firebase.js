// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_xkM1RQhL_nXg8Z3uG6mN-Djet_WLH4k",
  authDomain: "mypersonal-project-e1d8f.firebaseapp.com",
  projectId: "mypersonal-project-e1d8f",
  storageBucket: "mypersonal-project-e1d8f.firebasestorage.app",
  messagingSenderId: "493885403304",
  appId: "1:493885403304:web:0da8544dc1a42fa295129d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, signInWithEmailAndPassword, signOut, onAuthStateChanged, collection, addDoc, getDocs, query, orderBy, doc, setDoc, deleteDoc };
