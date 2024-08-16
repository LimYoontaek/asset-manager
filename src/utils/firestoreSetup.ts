import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, orderBy } from "firebase/firestore";
import { firebaseConfig } from "../../config/firebase";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const app = initializeApp(firebaseConfig);

// cloud firestore
export const database = getFirestore(app);
export const badgeRef = collection(database, "badges/badges/list");
export const badgeQuery = query(badgeRef, orderBy("id"));

// firebase auth
export const loginProvider = new GoogleAuthProvider();
export const auth = getAuth();

export const storage = getStorage();
export const gsQAstoragePath = "goldspoon/qa";
export const gsLivestoragePath = "goldspoon/live";
export const tmQAstoragePath = "themembers/live";
export const tmLivestoragePath = "themembers/live";

export const fileNameRegex = new RegExp(/badges_(\d+)_(\d+).json/);
