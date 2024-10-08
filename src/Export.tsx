import { useJsonDataStore } from "@src/store/store";
import {
  storage,
  gsQAstoragePath,
  fileNameRegex,
  gsLivestoragePath,
} from "@src/utils/firestoreSetup";
import { getDate } from "@src/utils/utils";
import {
  StorageReference,
  ref,
  getBlob,
  listAll,
  uploadBytes,
  getMetadata,
} from "firebase/storage";
import { useEffect, useState } from "react";

const Export = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportDate, setExportDate] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const setTarget = useJsonDataStore.use.setTarget();

  const exportBadges = async () => {
    //TODO: 파일 백업 후 새 데이터 전송
    // 1. 기존 파일 다운로드: badges.json
    // 2. 파일 목록 다운로드 후 새 revision 파일 생성: listAll => storageRef 생성
    // 3. 백업 파일 업로드(badges_revision_numbering), 새 파일 업로드(badges.json)

    setIsExporting(true);
    const currentJson = useJsonDataStore.getState().json;

    const isLive = useJsonDataStore.getState().target === gsLivestoragePath;
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
            const revision = isLive
              ? currentJson.revision - 1
              : currentJson.revision;
            const regex = new RegExp(`badges_${revision}_(\\d+).json`);
            const latestFileName = result.items
              .filter((item) => regex.test(item.name))
              .sort((a, b) => (a.name < b.name ? 1 : -1))[0];
            if (latestFileName) {
              console.log(`latestFileName`, latestFileName.name);
              const reg = regex.exec(latestFileName.name);
              console.log(reg);

              if (reg) {
                const numbering = Number(reg[1]) + 1;
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
              return ref(storageRef, `badges_${revision}_1.json`);
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
        .then((result) => {
          console.log(`new json data uploaded.`);
          setExportDate(result.metadata.updated);
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
                const numbering = Number(reg[2]) + 1;
                const jsonRef = ref(
                  storageRef,
                  `badges_${currentJson.revision}_${numbering}.json`,
                );
                console.log(`jsonRef`, jsonRef.name);
                return jsonRef;
              } else {
                return null;
              }
            } else {
              return ref(storageRef, `badges_${currentJson.revision}.json`);
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
        .then((result) => {
          console.log(`new json data uploaded.`);
          // setTarget(gsLivestoragePath);
          setPublishDate(result.metadata.updated);
        })
        .catch((e) => {
          console.error(`new json data upload failed`, e);
        })
        .finally(() => {
          setIsExporting(false);
        });
    }
  };

  useEffect(() => {
    const qaRef = ref(storage, gsQAstoragePath);
    const qaJsonRef = ref(qaRef, "badges.json");
    const liveRef = ref(storage, gsLivestoragePath);
    const liveJsonRef = ref(liveRef, "badges.json");

    Promise.all([getMetadata(qaJsonRef), getMetadata(liveJsonRef)])
      .then((results) => {
        setExportDate(results[0].updated);
        setPublishDate(results[1].updated);
      })
      .catch((e) => {
        console.error(`get metadata failed`, e);
      });
  }, []);

  useEffect(() => {
    const exportTime = new Date(exportDate).getTime();
    const publishTime = new Date(publishDate).getTime();
    console.log(`set latest json data`, exportTime, publishTime);

    if (!isNaN(exportTime) && !isNaN(publishTime)) {
      if (exportTime > publishTime) {
        setTarget(gsQAstoragePath);
      } else {
        setTarget(gsLivestoragePath);
      }
    }
  }, [exportDate, publishDate, setTarget]);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col">
        <p
          className={`${exportDate > publishDate ? "text-green-500" : "text-red-200"}`}
        >
          {getDate(exportDate)}
        </p>
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
      </div>

      <div className="flex flex-col">
        <p
          className={`${publishDate > exportDate ? "text-green-500" : "text-red-200"}`}
        >
          {getDate(publishDate)}
        </p>
        <button
          className="disabled:border-none disabled:bg-stone-50 disabled:text-slate-300"
          onClick={() => {
            publishBadges().catch((e) => {
              console.error(`publish badge failed`, e);
            });
          }}
          disabled={isExporting || publishDate > exportDate}
        >
          Publish
        </button>
      </div>
    </div>
  );
};

export default Export;
