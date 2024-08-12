import { RichTreeView } from "@mui/x-tree-view";
import { MENU, MenuType } from "@src/assets/menu";
import { database } from "@src/utils/firestoreSetup";
import {
  collection,
  DocumentData,
  getDocs,
  query,
  QuerySnapshot,
} from "firebase/firestore";

const isItemDisabled = (item: MenuType) => !item.active;

const Menu = () => {
  return (
    <RichTreeView
      items={MENU}
      isItemDisabled={isItemDisabled}
      onItemClick={(e: React.MouseEvent, itemId: string) => {
        console.log(itemId);

        //TODO: 배지 리스트 컴포넌트 생성
        //TODO: 메뉴 컴포넌트에서 배지 리스트 컴포넌트에 선택된 아이템 전달(zustand?)
        //TODO: 배지 리스트 컴포넌트에서 firestore 데이터 가져오기
        const getList = async () => {
          await getDocs(
            query(collection(database, `badges/${itemId}/list`)),
          ).then((snapShot: QuerySnapshot<DocumentData, DocumentData>) => {
            console.log(snapShot.docs);
          });
        };

        getList().catch((e) => {
          console.error(`get list failed`, e);
        });
      }}
    />
  );
};

export default Menu;
