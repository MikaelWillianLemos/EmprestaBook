import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseconfig = {
  apiKey: "AIzaSyBQPt0IGX4544UkwG2Xmeqw3ocmaznMaF0",
  authDomain: "emprestabook.firebaseapp.com",
  projectId: "emprestabook",
  storageBucket: "emprestabook.firebasestorage.app",
  messagingSenderId: "374304354067",
  appId: "1:374304354067:web:511d75ca0f218c76aeb4e6"
};

const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

export { db };
