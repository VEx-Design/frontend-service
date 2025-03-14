export interface Light {
  id: string;
  formInterfaceId?: string;
  params: LightParam[];
  path: LightPath;
}

export interface LightParam {
  paramId: string;
  value: number;
  unitPrefixId: string;
}

export interface LightPath {
  id: string;
  color: string;
}
