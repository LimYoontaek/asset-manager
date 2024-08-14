import { RichTreeView } from "@mui/x-tree-view";
import { MENU, MenuListType, MenuType } from "@src/assets/menu";
import { useMenuStore, useSelectedDataStore } from "@src/store/store";
const isItemDisabled = (item: MenuType) => !item.active;

const Menu = () => {
  const setMenu = useMenuStore.use.setMenu();
  const resetSelectedData = useSelectedDataStore.use.resetSelectedData();
  return (
    <RichTreeView
      items={MENU}
      isItemDisabled={isItemDisabled}
      onItemClick={(_e: React.MouseEvent, itemId: string) => {
        setMenu(itemId as MenuListType);
        resetSelectedData();
      }}
    />
  );
};

export default Menu;
