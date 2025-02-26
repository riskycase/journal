import { Dexie, type EntityTable } from "dexie";
import { JournalEntry } from "./types";
import dayjs, { Dayjs } from "dayjs";

const db = new Dexie("JournalEntries") as Dexie & {
  entires: EntityTable<JournalEntry, "date">;
};

const startDate = dayjs("01/01/1960", "DD/MM/YYYY");

db.version(1).stores({
  entries: "&date",
});

export async function saveEntry(date: Dayjs, content: string) {
  return await db.table("entries").put(
    {
      date: date.diff(startDate, "days"),
      entry: content,
    },
    date.diff(startDate, "days")
  );
}

export async function getEntry(date: Dayjs) {
  return await db.table("entries").get(date.diff(startDate, "days"));
}
