import { useCallback, useEffect, useState } from "react";
import "./App.css";
import {
  DocumentData,
  getDocs,
  onSnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { BadgeType } from "@type/badges";
import AddBadge from "@src/AddBadge";
import EditBadge from "@src/EditBadge";
import { auth, badgeQuery, storageRef } from "@util/firestoreSetup";
import Login from "./Login";
import { onAuthStateChanged } from "firebase/auth";
import { useLoginStore } from "./store/store";
import { ref, uploadBytes } from "firebase/storage";

const App = () => {
  const [data, setData] =
    useState<QueryDocumentSnapshot<DocumentData, DocumentData>[]>();
  const [selectedBadge, setSelectedBadge] = useState<QueryDocumentSnapshot<
    DocumentData,
    DocumentData
  > | null>();
  const [addBadge, setAddBadge] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState(false);

  const isLogin = useLoginStore.use.isLogin();
  const setIsLogin = useLoginStore.use.setIsLogin();

  const closeBadgeDetail = useCallback(() => {
    setSelectedBadge(null);
  }, []);

  const exportBadges = () => {
    setIsExporting(true);

    const badgeList = data?.map((badgeDoc) => JSON.stringify(badgeDoc.data()));
    const badgeBlob = new Blob([JSON.stringify(badgeList)], {
      type: "application/json",
    });
    const badgeRef = ref(storageRef, "badges.json");

    uploadBytes(badgeRef, badgeBlob)
      .then(() => {
        console.log("badges uploaded.");
      })
      .catch((e) => {
        console.error("badge upload failed.", e);
      })
      .finally(() => {
        setIsExporting(() => false);
      });
  };

  useEffect(() => {
    const getBadgeData = async () => {
      const badgeList: QueryDocumentSnapshot[] = [];

      const badgeSnap = await getDocs(badgeQuery);
      badgeSnap.forEach((badgeDoc) => {
        badgeList.push(badgeDoc);
      });
      setData(badgeList);
    };

    getBadgeData().catch((e) => console.log(`get badge data error`, e));

    // Firestore realtime listen
    const unsub = onSnapshot(badgeQuery, (querySnapshot) => {
      setData(querySnapshot.docs);
    });

    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(`user:`, user);
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    });

    return () => {
      unsub();
    };
  }, [setIsLogin]);

  return (
    <>
      <div className="flex justify-between">
        <Login />
        {isLogin && (
          <button
            className="disabled:border-none disabled:bg-stone-50 disabled:text-slate-300"
            onClick={exportBadges}
            disabled={isExporting}
          >
            Export
          </button>
        )}
      </div>
      {isLogin && (
        <>
          <div className="flex w-full flex-col gap-x-4 sm:flex-row">
            <div className="sm:w-[50%]">
              <div className="mb-4 flex items-center sm:text-center">
                <p className="grow">Badges({data?.length})</p>
                <button
                  className="h-fit w-fit"
                  onClick={() => {
                    setAddBadge((current) => !current);
                    closeBadgeDetail();
                  }}
                >
                  Add
                </button>
              </div>
              {data &&
                data.map((badgeDoc) => {
                  const badge = badgeDoc.data() as BadgeType;
                  return (
                    <p
                      className="my-4 cursor-pointer border-b-2"
                      key={badge.id}
                      onClick={() => {
                        if (selectedBadge !== badgeDoc) {
                          setSelectedBadge(badgeDoc);
                        } else {
                          closeBadgeDetail();
                        }
                      }}
                      aria-hidden="true"
                    >{`${badge.title} / ${badge["sub-title"]}`}</p>
                  );
                })}
            </div>
            <div className="sm:w-[50%]">
              {!addBadge && selectedBadge && (
                <EditBadge
                  key={selectedBadge.id}
                  selectedBadge={selectedBadge}
                  closeBadgeDetail={closeBadgeDetail}
                />
              )}
              {addBadge && <AddBadge setAddBadge={setAddBadge} />}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default App;
