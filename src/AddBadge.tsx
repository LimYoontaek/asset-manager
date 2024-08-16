import monaco from "monaco-editor";
import Editor from "@monaco-editor/react";
import { defaultBadgeData } from "@type/badges";
import { useRef } from "react";
import { useJsonDataStore } from "@src/store/store";

interface Props {
  setAddBadge: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddBadge = ({ setAddBadge }: Props) => {
  const addJsonData = useJsonDataStore.use.addJsonData();
  const newBadge = useRef<monaco.editor.IStandaloneCodeEditor>();

  const handleMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    newBadge.current = editor;
  };
  return (
    <>
      <div className="mb-4 flex items-center sm:text-center">
        <button onClick={() => setAddBadge(false)}>Cancel</button>
        <p className="grow">Add</p>
        <button
          onClick={() => {
            // const addDocument = async () => {
            //   if (newBadge.current) {
            //     await addDoc(badgeRef, JSON.parse(newBadge.current.getValue()))
            //       .then(() => {
            //         console.log(`new badge added.`);
            //         setAddBadge(false);
            //       })
            //       .catch((e) => console.log(`new badge add failed.`, e));
            //   }
            // };
            // addDocument().catch((e) => console.log(`new badge add error`, e));
            if (newBadge.current)
              addJsonData(JSON.parse(newBadge.current.getValue()));
            setAddBadge(false);
          }}
        >
          Save
        </button>
      </div>
      <Editor
        height="90vh"
        defaultLanguage="json"
        defaultValue={JSON.stringify(defaultBadgeData, null, "\t")}
        onMount={handleMount}
      />
    </>
  );
};

export default AddBadge;
