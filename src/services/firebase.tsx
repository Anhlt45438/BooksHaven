// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDfIFW1NSGhDO6QEVKMJj69EuF20sgE9Gg",
    authDomain: "bookshaven-3a30b.firebaseapp.com",
    projectId: "bookshaven-3a30b",
    storageBucket: "bookshaven-3a30b.firebasestorage.app",
    messagingSenderId: "107646354296",
    appId: "1:107646354296:web:6c9aebbc0a4e4d0609fe8d",
    measurementId: "G-RQH4MJ9FWX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);