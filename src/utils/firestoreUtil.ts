import * as badges from "@public/badges.json";
import { addDoc } from "firebase/firestore";
import { badgeRef } from "@util/firestoreSetup";
import { BadgeType } from "@src/types/badges";

const addDocument = async (badge: BadgeType) => {
  await addDoc(badgeRef, badge)
    .then(() => {
      console.log(`data added.`);
    })
    .catch((e) => {
      console.error(`data add failed`, e);
    });
};

badges.json.badges.badges.map((badge: BadgeType) => {
  addDocument(badge).catch((e) => console.log(`batch operation error.`, e));
});
