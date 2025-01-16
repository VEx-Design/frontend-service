import { ParamsResponse } from "../actions/getParameter";
import { NodeTransferType } from "../types/object";

export const createNewTransfer = (
  params: ParamsResponse[],
  config: NodeTransferType[]
): NodeTransferType[] => {
  let transfer: NodeTransferType[] = [];

  params.forEach((param) => {
    const found = config.find((c) => c.name === param.name);
    transfer = [
      ...transfer,
      {
        id: param.id,
        name: param.name,
        symbol: param.symbol,
        value: "0",
      },
    ];
  });

  return transfer;
};
