export interface Light {
  id: string;
  formInterfaceId?: string;
  params: LightParam[];
}

export interface LightParam {
  paramId: string;
  value: number;
  unitPrefixId: string;
}
