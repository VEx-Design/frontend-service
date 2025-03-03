import { Type } from "./types/Type";

export default function editImage(type: Type, fileName: string): Type {
  return {
    ...type,
    picture: fileName,
  };
}
