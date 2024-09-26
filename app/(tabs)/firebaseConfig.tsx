import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC5NwaLv4R2QJ1cwpLo2a-Zu2R1KfaVGlg",
    authDomain: "lab5-5b6e1.firebaseapp.com",
    projectId: "lab5-5b6e1",
    storageBucket: "lab5-5b6e1.appspot.com",
    messagingSenderId: "402638665798",
    appId: "1:402638665798:web:82aca87cb86addc0e3b247",
    measurementId: "G-L44LLVKCW7"
  };

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
