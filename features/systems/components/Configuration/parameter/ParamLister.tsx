import React from "react";

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
import ParamItem from "./ParamItem";
import { Parameter } from "@/features/systems/libs/ClassParameter/types/Parameter";
import { useConfig } from "@/features/systems/contexts/ProjectWrapper/ConfigContext";

export default function ParamLister() {
  const { config, configAction } = useConfig();

  const display: ListerDisplay = {};

  const indepParams: Parameter[] = config.parameters.filter((param) =>
    config.parameterGroups.every(
      (group) => !group.parameterIds.includes(param.id)
    )
  );

  return (
    <Lister
      data={config.parameters}
      loading={false}
      isNotEmpty={config.parameterGroups.length > 0}
    >
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
          render={({}) => (
            <div className="flex flex-1 flex-col gap-2">
              {indepParams.map((param) => (
                <ParamItem key={param.id?.toString()} param={param} />
              ))}
              {config.parameterGroups.map((group) => (
                <div
                  key={group.id?.toString()}
                  className="flex flex-col gap-2 border border-gray-300 p-2 rounded-md"
                >
                  <p className="text-sm font-bold border-b pb-2">
                    {group.name}
                  </p>
                  <div className="flex flex-col gap-2">
                    {group.parameterIds.map((item) => {
                      const param = configAction.getParameter(item);
                      if (!param) return null;
                      return (
                        <ParamItem
                          key={param.id?.toString()}
                          param={param}
                          paramGroup={group.id}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        />
      </ListerContent>
    </Lister>
  );
}
