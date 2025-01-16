import { ParamsResponse } from "../actions/getParameter";
import { NodeParamType } from "../types/object";

export const createNewTransfer = (
  params: ParamsResponse[],
  config: NodeParamType[]
): NodeParamType[] => {
  let transfer: NodeParamType[] = [];

  params.forEach((param) => {
    if (config === undefined || config.length === 0) {
      transfer = [
        ...transfer,
        {
          id: param.id,
          name: param.name,
          symbol: param.symbol,
          value: "0",
        },
      ];
    } else {
      const found = config.find((c) => c.name === param.name);
      if (!found) {
        transfer = [
          ...transfer,
          {
            id: param.id,
            name: param.name,
            symbol: param.symbol,
            value: "0",
          },
        ];
      }
    }
  });

  return transfer;
};
