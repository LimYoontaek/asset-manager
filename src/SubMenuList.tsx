import { MenuList } from "@src/assets/menu";
import {
  useJsonDataStore,
  useMenuStore,
  useSelectedDataStore,
} from "@src/store/store";
import {
  BadgeJsonType,
  BadgeType,
  BadgeUnionType,
  GenderBadgeType,
} from "@src/types/badges";
import { useEffect, useState } from "react";

interface Props {
  setAddBadge: React.Dispatch<React.SetStateAction<boolean>>;
}

const SubMenuList = ({ setAddBadge }: Props) => {
  const selectedMenu = useMenuStore.use.selectedMenu();
  const jsonData = useJsonDataStore.use.json();
  const setSelectedIndex = useSelectedDataStore.use.setSelectedIndex();
  const setSelectedBadge = useSelectedDataStore.use.setSelectedBadge();
  const selectedBadge = useSelectedDataStore.use.selectedBadge();
  const resetSelectedData = useSelectedDataStore.use.resetSelectedData();
  const [data, setData] = useState<BadgeJsonType>();

  const onBadgeClick = (badge: BadgeUnionType, idx: number) => {
    if (selectedBadge !== badge) {
      setSelectedBadge(badge);
      setSelectedIndex(idx);
    } else {
      resetSelectedData();
    }
  };

  useEffect(() => {
    switch (selectedMenu) {
      case MenuList.BADGES:
      case MenuList.FEMALE:
      case MenuList.MALE:
        {
          if (jsonData) setData(jsonData[selectedMenu]);
        }
        break;
      case MenuList.REVISION:
      case MenuList.TIP:
        {
          if (jsonData) {
            setData(jsonData[selectedMenu]);
          }
        }
        break;
    }
  }, [selectedMenu, jsonData]);

  return (
    <>
      <div className="mb-4 flex min-h-12 items-center sm:text-center">
        <p className="grow">
          {selectedMenu}
          {Array.isArray(data) && `(${data?.length})`}
        </p>
        {selectedMenu === MenuList.BADGES && (
          <button
            className="h-fit w-fit"
            onClick={() => {
              setAddBadge((current) => !current);
              resetSelectedData();
            }}
          >
            Add
          </button>
        )}
      </div>
      {data &&
        Array.isArray(data) &&
        data.map((badge: BadgeType | GenderBadgeType, idx: number) => {
          return (
            <p
              className="my-4 cursor-pointer border-b-2"
              key={`${"id" in badge && badge.id}${badge.title}`}
              onClick={() => onBadgeClick(badge, idx)}
              aria-hidden="true"
            >
              {"id" in badge && `${badge.id} - `}
              {badge.title || selectedMenu}
              {"sub-title" in badge && ` / ${badge["sub-title"]}`}
            </p>
          );
        })}
      {data && !Array.isArray(data) && (
        <p
          className="my-4 cursor-pointer border-b-2"
          onClick={() => onBadgeClick(data, 0)}
          aria-hidden="true"
        >
          {selectedMenu}
        </p>
      )}
    </>
  );
};

export default SubMenuList;
