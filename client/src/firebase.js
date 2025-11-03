import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace this with your own Firebase config object!
const firebaseConfig = {
  apiKey: "AIzaSyC5nJJh5Izcej0m3tZPhdFgPPA8zimRdSQ",
  authDomain: "newsportal-3fc27.firebaseapp.com",
  projectId: "newsportal-3fc27",
  storageBucket: "newsportal-3fc27.firebasestorage.app",
  messagingSenderId: "640056601961",
  appId: "1:640056601961:web:3653558320e96770d921f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the auth service
export const auth = getAuth(app);