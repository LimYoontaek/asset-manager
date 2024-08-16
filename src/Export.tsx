import { useJsonDataStore } from "@src/store/store";
import {
  storage,
  gsQAstoragePath,
  fileNameRegex,
  gsLivestoragePath,
} from "@src/utils/firestoreSetup";
import { getBadges } from "@src/utils/firestoreUtil";
import {
  StorageReference,
  ref,
  getBlob,
  listAll,
  uploadBytes,
} from "firebase/storage";
import { useState } from "react";

const Export = () => {
  const [isExporting, setIsExporting] = useState(false);
  const setJsonData = useJsonDataStore.use.setJsonData();

  const exportBadges = async () => {
    //TODO: 파일 백업 후 새 데이터 전송
    // 1. 기존 파일 다운로드: badges.json
    // 2. 파일 목록 다운로드 후 새 revision 파일 생성: listAll => storageRef 생성
    // 3. 백업 파일 업로드(badges_revision_numbering), 새 파일 업로드(badges.json)

    setIsExporting(true);
    const currentJson = useJsonDataStore.getState().json;
    if (currentJson) {
      const storageRef: StorageReference = ref(storage, gsQAstoragePath);
      const jsonRef = ref(storageRef, "badges.json");

      // 백업 파일 업로드
      const downloadLatestBadges = await getBlob(jsonRef)
        .then((data: Blob) => data)
        .catch((e) => {
          console.error(`latest badges download failed`, e);
        });

      const backupRef = await listAll(storageRef)
        .then((result) => {
          if (result) {
            const latestFileName = result.items
              .filter((item) => fileNameRegex.test(item.name))
              .sort((a, b) => (a.name < b.name ? 1 : -1))[0];
            if (latestFileName) {
              console.log(`latestFileName`, latestFileName.name);
              const reg = fileNameRegex.exec(latestFileName.name);
              console.log(reg);

              if (reg) {
                const revision = Number(reg[1]);
                const numbering = Number(reg[2]) + 1;
                const jsonRef = ref(
                  storageRef,
                  `badges_${revision}_${numbering}.json`,
                );
                console.log(`jsonRef`, jsonRef.name);
                return jsonRef;
              } else {
                return null;
              }
            } else {
              return ref(storageRef, `badges_${currentJson.revision}_1.json`);
            }
          }
        })
        .catch((e) => {
          console.error(`list all error`, e);
        });

      if (downloadLatestBadges && backupRef) {
        uploadBytes(backupRef, downloadLatestBadges)
          .then(() => {
            console.log(`backup json data uploaded.`);
          })
          .catch((e) => {
            console.error(`backup json data upload failed`, e);
          });
      }

      // 새 파일 업로드
      const newJson = {
        json: {
          badges: currentJson,
        },
      };
      const blob = new Blob([JSON.stringify(newJson)], {
        type: "application/json",
      });

      uploadBytes(jsonRef, blob)
        .then(() => {
          console.log(`new json data uploaded.`);
          getBadges(storageRef)
            .then((result) => {
              if (result) {
                setJsonData(result);
              }
            })
            .catch((e) => {
              console.error(`error after export new json`, e);
            });
        })
        .catch((e) => {
          console.error(`new json data upload failed`, e);
        })
        .finally(() => {
          setIsExporting(false);
        });
    }
  };

  const publishBadges = async () => {
    setIsExporting(true);
    const currentJson = useJsonDataStore.getState().json;
    if (currentJson) {
      const revision = currentJson.revision + 1;
      const newJson = {
        json: {
          badges: {
            ...currentJson,
            revision,
          },
        },
      };
      const storageRef: StorageReference = ref(storage, gsLivestoragePath);

      const jsonRef = ref(storageRef, "badges.json");

      // 기존 파일 다운로드
      const downloadLatestBadges = await getBlob(jsonRef)
        .then((data: Blob) => data)
        .catch((e) => {
          console.error(`latest badges download failed`, e);
        });

      const backupRef = await listAll(storageRef)
        .then((result) => {
          if (result) {
            const latestFileName = result.items
              .filter((item) => fileNameRegex.test(item.name))
              .sort((a, b) => (a.name < b.name ? 1 : -1))[0];
            if (latestFileName) {
              console.log(`latestFileName`, latestFileName.name);
              const reg = fileNameRegex.exec(latestFileName.name);
              console.log(reg);

              if (reg) {
                const revision = Number(reg[1]);
                const numbering = Number(reg[2]) + 1;
                const jsonRef = ref(
                  storageRef,
                  `badges_${revision}_${numbering}.json`,
                );
                console.log(`jsonRef`, jsonRef.name);
                return jsonRef;
              } else {
                return null;
              }
            } else {
              return ref(storageRef, `badges_${currentJson.revision}_1.json`);
            }
          }
        })
        .catch((e) => {
          console.error(`list all error`, e);
        });

      if (downloadLatestBadges && backupRef) {
        uploadBytes(backupRef, downloadLatestBadges)
          .then(() => {
            console.log(`backup json data uploaded.`);
          })
          .catch((e) => {
            console.error(`backup json data upload failed`, e);
          });
      }

      const blob = new Blob([JSON.stringify(newJson)], {
        type: "application/json",
      });
      uploadBytes(jsonRef, blob)
        .then(() => {
          console.log(`new json data uploaded.`);
          getBadges(storageRef)
            .then((result) => {
              if (result) {
                setJsonData(result);
              }
            })
            .catch((e) => {
              console.error(`error after publish new json`, e);
            });
        })
        .catch((e) => {
          console.error(`new json data upload failed`, e);
        })
        .finally(() => {
          setIsExporting(false);
        });
    }
  };
  return (
    <div className="flex gap-4">
      <button
        className="disabled:border-none disabled:bg-stone-50 disabled:text-slate-300"
        onClick={() => {
          exportBadges().catch((e) => {
            console.error(`export badge failed`, e);
          });
        }}
        disabled={isExporting}
      >
        Export
      </button>
      <button
        className="disabled:border-none disabled:bg-stone-50 disabled:text-slate-300"
        onClick={() => {
          publishBadges().catch((e) => {
            console.error(`publish badge failed`, e);
          });
        }}
        disabled={isExporting}
      >
        Publish
      </button>
    </div>
  );
};

export default Export;
