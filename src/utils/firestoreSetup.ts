import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, orderBy } from "firebase/firestore";
import { firebaseConfig } from "../../config/firebase";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage, ref, StorageReference } from "firebase/storage";

const app = initializeApp(firebaseConfig);

// cloud firestore
export const database = getFirestore(app);
export const badgeRef = collection(database, "badges/badges/list");
export const badgeQuery = query(badgeRef, orderBy("id"));

// firebase auth
export const loginProvider = new GoogleAuthProvider();
export const auth = getAuth();

const storage = getStorage();
export const storageRef: StorageReference = ref(storage, "Badges");
