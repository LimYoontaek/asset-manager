import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, orderBy } from "firebase/firestore";
import { firebaseConfig } from "@config/firebase";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const app = initializeApp(firebaseConfig);

// cloud firestore
export const database = getFirestore(app);
export const badgeRef = collection(database, "root/badges/badgeList");
export const badgeQuery = query(badgeRef, orderBy("id"));

// firebase auth
export const loginProvider = new GoogleAuthProvider();
export const auth = getAuth();
