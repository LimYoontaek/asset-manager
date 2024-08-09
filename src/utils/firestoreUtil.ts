import * as badges from "../../public/badges.json";
import { addDoc, collection, getDocs, setDoc, doc } from "firebase/firestore";
import { badgeRef, database } from "../utils/firestoreSetup";
import { BadgeType, GenderBadgeType } from "../types/badges";

// const addDocument = async (badge: BadgeType) => {
//   await addDoc(badgeRef, badge)
//     .then(() => {
//       console.log(`data added.`);
//     })
//     .catch((e) => {
//       console.error(`data add failed`, e);
//     });
// };

// badges.json.badges.badges.map((badge: BadgeType) => {
//   addDocument(badge).catch((e) => console.log(`batch operation error.`, e));
// });
badges.json.badges.male.map((badge: GenderBadgeType) => {
  const newRef = collection(database, "badges/male/list");
  const addDocs = async () => {
    await addDoc(newRef, badge).then((data) => {
      console.log(`new doc added: `, data.id);
    });
  };
  addDocs().catch((e) => {
    console.error(`add male badge failed`, e);
  });
});

// const copyDocs = () => {
//   // const root = collection(database, "root");
//   getDocs(badgeRef)
//     .then((docs) => {
//       docs.docs.map((docData) => {
//         console.log(`doc info:`, docData.id);
//         const newCollection = collection(database, "badges", "badges", "list");

//         const addDocs = async () => {
//           await addDoc(newCollection, docData.data())
//             .then(() => {
//               console.log(`doc added`, docData.id);
//             })
//             .catch((e) => {
//               console.error(`doc add failed.`, e);
//             });
//         };
//         addDocs().catch((e) => {
//           console.error(`doc add failed.`, e);
//         });
//       });
//     })
//     .catch((e) => {
//       console.error(`get docs failed`, e);
//     });
// };

// copyDocs();
