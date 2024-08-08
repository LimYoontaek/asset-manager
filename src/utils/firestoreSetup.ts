import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, orderBy } from "firebase/firestore";
import { firebaseConfig } from "@config/firebase";

const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const badgeRef = collection(database, "root/badges/badgeList");
export const badgeQuery = query(badgeRef, orderBy("id"));
