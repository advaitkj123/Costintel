import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBuKqCkDK1Thz9fcvqH1vkDIWJ0DdeSsvQ",
  authDomain: "costintel-543ab.firebaseapp.com",
  projectId: "costintel-543ab",
  storageBucket: "costintel-543ab.firebasestorage.app",
  messagingSenderId: "374100742544",
  appId: "1:374100742544:web:14c9051da09648dc6ce315"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
