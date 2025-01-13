import { Data } from "./Lister";

export const compareString = (
  datas: Data[],
  key: string,
  value: string
): Data[] => {
  return datas.filter((data) => data[key] === value);
};
