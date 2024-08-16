// load qa badges.json

import { JsonDataType } from "@src/store/store";
import { getBlob, ref, StorageReference } from "firebase/storage";

// getBadges = (storageRef, setData) => void
export const getBadges = (storageRef: StorageReference) => {
  const jsonRef = ref(storageRef, "badges.json");
  return getBlob(jsonRef).then((data: Blob) => {
    const jsonParse = async () => {
      const jsonData = JSON.parse(await data.text()) as {
        json: { badges: JsonDataType };
      };
      console.log(`badges.json from ${storageRef.name} downloaded.`, jsonData);
      return jsonData;
    };

    return jsonParse()
      .then((data) => {
        return data.json.badges;
      })
      .catch((e) => {
        console.error(`parsing error.`, e);
      });
  });
};

// 백업 파일 생성
// uploadBackup = (storageRef) => void

// 새 파일 생성
// uploadNewJson = (jsonRef, blob) => void
