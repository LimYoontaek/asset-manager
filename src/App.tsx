import { useEffect, useState } from "react";
import "./App.css";
import AddBadge from "@src/AddBadge";
import EditBadge from "@src/EditBadge";
import { auth, jsonRef } from "@util/firestoreSetup";
import Login from "./Login";
import { onAuthStateChanged } from "firebase/auth";
import {
  JsonDataType,
  useJsonDataStore,
  useLoginStore,
  useMenuStore,
  useSelectedDataStore,
} from "./store/store";
import { getBlob } from "firebase/storage";
import Menu from "@src/Menu";
import SubMenuList from "@src/SubMenuList";

const App = () => {
  const selectedBadge = useSelectedDataStore.use.selectedBadge();
  const selectedMenu = useMenuStore.use.selectedMenu();

  const [addBadge, setAddBadge] = useState<boolean>(false);
  // const [isExporting, setIsExporting] = useState(false);

  const isLogin = useLoginStore.use.isLogin();
  const setIsLogin = useLoginStore.use.setIsLogin();

  const setJsonData = useJsonDataStore.use.setJsonData();

  const exportBadges = () => {};

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

  useEffect(() => {
    if (isLogin) {
      getBlob(jsonRef)
        .then((data: Blob) => {
          const jsonParse = async () => {
            const jsonData = JSON.parse(await data.text()) as {
              json: { badges: JsonDataType };
            };
            console.log(`badges.json downloaded.`, jsonData);
            setJsonData(jsonData.json.badges);
          };

          jsonParse().catch((e) => {
            console.error(`parsing error.`, e);
          });
        })
        .catch((e) => {
          console.error(`badges.json download error`, e);
        });
    }
  }, [isLogin, setJsonData]);

  return (
    <>
      <h1 className="w-full text-center">Asset Manager</h1>
      <div className="flex justify-between">
        <Login />
        {isLogin && (
          <button
            className="disabled:border-none disabled:bg-stone-50 disabled:text-slate-300"
            onClick={exportBadges}
            disabled={true}
          >
            Export
          </button>
        )}
      </div>
      {isLogin && (
        <div className="flex w-full flex-col gap-x-4 sm:flex-row">
          <div className="sm:w-[20%]">
            <Menu />
          </div>
          <div className="sm:w-[40%]">
            <SubMenuList setAddBadge={setAddBadge} />
          </div>
          <div className="sm:w-[40%]">
            {!addBadge && selectedBadge && (
              <EditBadge
                key={`${selectedMenu}-${typeof selectedBadge == "object" ? ("id" in selectedBadge ? selectedBadge.id : "title" in selectedBadge ? selectedBadge.title : "") : ""}`}
              />
            )}
            {addBadge && <AddBadge setAddBadge={setAddBadge} />}
          </div>
        </div>
      )}
    </>
  );
};

export default App;
