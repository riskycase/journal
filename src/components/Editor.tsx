import { getEntry, saveEntry } from "@/utils/database";
import { Flex, Text, Textarea } from "@chakra-ui/react";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { MdDone, MdTimer3 } from "react-icons/md";
import { SpinningCircles } from "react-loading-icons";

enum SaveStates {
  SAVED,
  SAVING,
  EDITED,
}

export default function Editor({ date }: { date: Dayjs }) {
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout>();
  const [savedContent, setSavedContent] = useState("");
  const [lastSaved, setLastSaved] = useState(Date.now());
  const [saveState, setSaveState] = useState(SaveStates.SAVED);
  const [entry, setEntry] = useState("Fetching from database... Please wait");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEntry(date).then((entry) => {
      setEntry(entry?.entry || "");
      setLoading(false);
    });
  }, []);

  function saveEntryToDatabase(entry: string) {
    setSaveState(SaveStates.SAVING);
    const lastSaved = Date.now();
    saveEntry(date, entry).then(() => {
      setSavedContent(entry);
      setSaveState(SaveStates.SAVED);
      setLastSaved(lastSaved);
    });
  }

  return (
    <Flex direction="column" flex={1} alignItems="stretch" padding={2}>
      <Flex
        direction="row"
        alignSelf="start"
        gap={1}
        paddingX={4}
        paddingY={1}
        alignItems="center"
      >
        {saveState === SaveStates.SAVING ? (
          <>
            <SpinningCircles
              style={{
                width: "1rem",
                height: "1rem",
              }}
            />
            <Text fontStyle="italic">Saving...</Text>
          </>
        ) : saveState === SaveStates.SAVED ? (
          <>
            <MdDone />
            <Text fontStyle="italic">Saved!</Text>
          </>
        ) : (
          <>
            <MdTimer3 />
            <Text fontStyle="italic">Waiting to finish editing</Text>
          </>
        )}
      </Flex>
      <Textarea
        flex={1}
        placeholder={`Journal entry for ${date.format(
          "DD MMMM, YYYY"
        )} is not present... yet`}
        value={entry}
        onChange={(e) => {
          clearTimeout(saveTimeout);
          setEntry(e.target.value);
          setSaveState(SaveStates.EDITED);
          setSaveTimeout(setTimeout(saveEntryToDatabase, 2500, e.target.value));
          if (
            e.target.value !== savedContent &&
            Date.now() - lastSaved >= 30000
          ) {
            saveEntryToDatabase(e.target.value);
            console.log("Long term saved");
          }
        }}
        readOnly={loading}
        fontSize="large"
      />
    </Flex>
  );
}
