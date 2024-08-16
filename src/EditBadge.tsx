import { JsonData, JsonEditor } from "json-edit-react";
import { useState } from "react";
import { BadgeUnionType } from "@src/types/badges";
import {
  useJsonDataStore,
  useMenuStore,
  useSelectedDataStore,
} from "@src/store/store";
import { MenuList } from "@src/assets/menu";

const EditBadge = () => {
  const selectedBadge = useSelectedDataStore.use.selectedBadge();
  const selectedMenu = useMenuStore.use.selectedMenu();

  const [selectedBadgeData, setSelectedBadgeData] =
    useState<BadgeUnionType | null>(selectedBadge);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const selectedIndex = useSelectedDataStore.use.selectedIndex();
  const resetSelectedData = useSelectedDataStore.use.resetSelectedData();
  const updateSelectedData = useJsonDataStore.use.updateSelectedData();
  const deleteSelectedData = useJsonDataStore.use.deleteSelectedData();

  const updateBadgeData = (newData: BadgeUnionType | null) => {
    if (newData) updateSelectedData(newData, selectedIndex);
    resetSelectedData();
  };

  const deleteBadge = () => {
    deleteSelectedData(selectedIndex);
    resetSelectedData();
  };

  return (
    <>
      <div className="mb-4 flex items-center">
        <button
          className="mr-4"
          onClick={() => {
            resetSelectedData();
          }}
        >
          Close
        </button>
        <p className="grow text-center">Detail</p>
        {selectedBadge && (
          <>
            {selectedMenu !== MenuList.REVISION &&
              selectedMenu !== MenuList.TIP && (
                <button
                  className="h-fit w-fit"
                  onClick={() => {
                    deleteBadge();
                  }}
                >
                  Delete
                </button>
              )}

            {isEdited && (
              <button
                className="ml-4 h-fit w-fit"
                onClick={() => {
                  updateBadgeData(selectedBadgeData);
                }}
              >
                Save
              </button>
            )}
          </>
        )}
      </div>

      <JsonEditor
        data={selectedBadgeData as JsonData}
        setData={(newData) => setSelectedBadgeData(newData as BadgeUnionType)}
        onEdit={() => {
          console.log(`isEdited`);
          setIsEdited(true);
        }}
        onDelete={() => setIsEdited(true)}
        keySort={true}
      />
    </>
  );
};

export default EditBadge;
