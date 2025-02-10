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

export const sortDate = (
  datas: Data[],
  key: string,
  asc: boolean = true
): Data[] => {
  return [...datas].sort(
    (a, b) =>
      (new Date(a[key]).getTime() - new Date(b[key]).getTime()) * (asc ? 1 : -1)
  );
};
