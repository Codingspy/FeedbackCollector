// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: 'AIzaSyAKaDKMyEAIeUDJGO_be5ZNRL_yQc6v3Rw',
  authDomain: "fir-config-c636f.firebaseapp.com",
  databaseURL: "https://fir-config-c636f-default-rtdb.firebaseio.com",
  projectId: "fir-config-c636f",
  storageBucket: "fir-config-c636f.firebasestorage.app",
  messagingSenderId: "484386280533",
  appId: "1:484386280533:web:2b63671d15816eeb18f0dc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
