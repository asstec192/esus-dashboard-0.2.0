//@ts-ignore
import commandScore from "command-score";

export const filterComboboxOptions = (value: string, search: string) => {
  const normalizedValue = value.normalize("NFD").replace(/[^a-zA-Z\s]/g, "");
  const normalizedSearch = search.normalize("NFD").replace(/[^a-zA-Z\s]/g, "");
  return commandScore(normalizedValue, normalizedSearch) as number;
};
