import {
  setDoc,
  doc,
  deleteDoc,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { JsonData, JsonEditor } from "json-edit-react";
import { database } from "@util/firestoreSetup";
import { useState } from "react";

interface Props {
  selectedBadge: QueryDocumentSnapshot<DocumentData, DocumentData>;
  closeBadgeDetail: () => void;
}

const EditBadge = ({ selectedBadge, closeBadgeDetail }: Props) => {
  const [selectedBadgeData, setSelectedBadgeData] = useState<JsonData>(
    selectedBadge.data(),
  );
  const [isEdited, setIsEdited] = useState<boolean>(false);

  const updateBadgeData = async (id: string, newData: JsonData) => {
    await setDoc(
      doc(database, "root/badges/badgeList", id),
      JSON.parse(JSON.stringify(newData)),
    )
      .then(() => {
        console.log(`set success`);
        closeBadgeDetail();
      })
      .catch((e) => {
        console.log(`set failed`, e);
      });
  };

  const deleteBadge = async (id: string) => {
    await deleteDoc(doc(database, "root/badges/badgeList", id))
      .then(() => {
        closeBadgeDetail();
        setSelectedBadgeData({});

        console.log(`remove success`);
      })
      .catch((e) => {
        console.log(`remove failed`, e);
      });
  };

  // useEffect(() => {
  //   console.log(selectedBadge);
  //   setSelectedBadgeData(selectedBadge.data());
  // }, [selectedBadge]);

  return (
    <>
      <div className="mb-4 flex items-center">
        <button
          className="mr-4"
          onClick={() => {
            closeBadgeDetail();
          }}
        >
          Close
        </button>
        <p className="grow text-center">Detail</p>
        {selectedBadge && selectedBadge.id && (
          <>
            <button
              className="h-fit w-fit"
              onClick={() => {
                deleteBadge(selectedBadge.id).catch((e) =>
                  console.log(`delete badge error`, e),
                );
                setSelectedBadgeData({});
              }}
            >
              Delete
            </button>
            {isEdited && (
              <button
                className="ml-4 h-fit w-fit"
                onClick={() => {
                  updateBadgeData(selectedBadge.id, selectedBadgeData).catch(
                    (e) => console.log(`update badge data error`, e),
                  );
                }}
              >
                Save
              </button>
            )}
          </>
        )}
      </div>

      <JsonEditor
        data={selectedBadgeData}
        setData={(newData) => setSelectedBadgeData(newData)}
        onEdit={() => setIsEdited(true)}
        onDelete={() => setIsEdited(true)}
        keySort={true}
      />
    </>
  );
};

export default EditBadge;
