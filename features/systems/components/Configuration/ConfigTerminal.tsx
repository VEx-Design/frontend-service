import React from "react";
import { ConfigurationContext } from "../Project";

export default function ConfigTerminal() {
  const context = React.useContext(ConfigurationContext);
  if (!context) {
    throw new Error("TypeLister must be used within a ConfigurationContext");
  }

  console.log(context.currentType?.output);

  return (
    <div className="flex flex-1 px-4 py-2">
      <div className="text-H3 font-bold">{context.currentType?.name}</div>

      {/* {Array.from(Array(context.currentType?.output).keys()).map((output) => (
        <div key={output} className="flex flex-row gap-2">
          <div className="text-H4 font-bold">fs;djl</div>
        </div>
      ))} */}
    </div>
  );
}
