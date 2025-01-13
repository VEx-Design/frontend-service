import { Data } from "./Lister";

export const sortString = (
  datas: Data[],
  key: string,
  asc: boolean = true
): Data[] => {
  return [...datas].sort(
    (a, b) => a[key].localeCompare(b[key]) * (asc ? 1 : -1)
  );
};
