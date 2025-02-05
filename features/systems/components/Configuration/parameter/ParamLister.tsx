import React, { useContext, useEffect } from "react";

import {
  Lister,
  ListerContent,
  ListerContentEmpty,
  ListerContentLoading,
  ListerContentView,
  ListerDisplay,
  ListerHeader,
  ListerHeaderControl,
} from "@/components/lists/Lister";
import { Loading } from "@/src/components/loading";
import CreateParameterDialog from "./CreateParameterDialog";
import { Parameter } from "@/features/systems/types/config";
import { ProjectContext } from "@/features/systems/contexts/ProjectContext";

export default function ParamLister() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("TypeLister must be used within a ProjectContext");
  }
  const [parameters, setParameters] = React.useState<Parameter[]>([]);

  useEffect(() => {
    if (context.config) {
      setParameters(context.config.parameters);
    }
  }, [context.config]);

  const display: ListerDisplay = {};

  return (
    <Lister data={parameters} loading={false}>
      <ListerHeader title="Parameter" size="small">
        <ListerHeaderControl>
          <CreateParameterDialog />
        </ListerHeaderControl>
      </ListerHeader>
      <ListerContent>
        <ListerContentEmpty>
          <p className="p-3 text-sm text-gray-500 text-center">
            Your project parameter is empty. Start by creating a new parameter
          </p>
        </ListerContentEmpty>
        <ListerContentLoading>
          <Loading />
        </ListerContentLoading>
        <ListerContentView
          listDisplay={display}
          render={({ data }) => (
            <div className="flex flex-1 flex-col gap-2">
              {data.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 py-1"
                >
                  <p className="text-sm font-bold">{`${item.name} [${item.symbol}]`}</p>
                  <button className="text-sm text-gray-500 hover:bg-gray-100 p-1 rounded-md">
                    Edit
                  </button>
                </div>
              ))}
            </div>
          )}
        />
      </ListerContent>
    </Lister>
  );
}
