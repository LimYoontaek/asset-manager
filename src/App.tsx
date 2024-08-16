import { useEffect, useState } from "react";
import "./App.css";
import AddBadge from "@src/AddBadge";
import EditBadge from "@src/EditBadge";
import { auth } from "@util/firestoreSetup";
import Login from "./Login";
import { onAuthStateChanged } from "firebase/auth";
import {
  useJsonDataStore,
  useLoginStore,
  useMenuStore,
  useSelectedDataStore,
} from "./store/store";
import Menu from "@src/Menu";
import SubMenuList from "@src/SubMenuList";
import { getBadges } from "@src/utils/firestoreUtil";
import Export from "@src/Export";

const App = () => {
  const selectedBadge = useSelectedDataStore.use.selectedBadge();
  const selectedMenu = useMenuStore.use.selectedMenu();

  const [addBadge, setAddBadge] = useState<boolean>(false);

  const isLogin = useLoginStore.use.isLogin();
  const setIsLogin = useLoginStore.use.setIsLogin();

  const setJsonData = useJsonDataStore.use.setJsonData();
  const target = useJsonDataStore.use.target();

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
      getBadges(target)
        .then((result) => {
          if (result) setJsonData(result);
        })
        .catch((e) => {
          console.error(`get badges failed`, e);
        });
    }
  }, [isLogin, setJsonData, target]);

  return (
    <>
      <h1 className="w-full text-center">Asset Manager</h1>
      <div className="w-full text-center">{target.name.toUpperCase()}</div>
      <div className="flex justify-between">
        <Login />
        {isLogin && <Export />}
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
