import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDWwdARr1iQbG4Rc6FJz4RagU3Da5i8Yxo",
    authDomain: "d4tmp3.firebaseapp.com",
    projectId: "d4tmp3",
    storageBucket: "d4tmp3.appspot.com",
    messagingSenderId: "698382410214",
    appId: "1:698382410214:web:19e98827320596a5b73627",
    measurementId: "G-YVWDG4BBWL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database = getFirestore(app);
export const auth = getAuth(app);
