import React, { useCallback } from "react";
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
import { ProjectContext } from "../../Project";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import createInterface from "@/features/systems/libs/createInterface";
import InterfaceBox from "./InterfaceBox";
import { Position } from "@xyflow/react";

export default function InterfaceLister() {
  const context = React.useContext(ProjectContext);
  if (!context)
    throw new Error("ConfigTerminal must be used within a ProjectContext");

  const onClick = useCallback(() => {
    toast.loading("Creating Interface...", { id: "create-interface" });

    if (context.currentType) {
      createInterface(context.currentType)
        .then((result) => {
          context.setCurrentType({ ...result }); // Ensure new reference
          toast.success("Interface Created!", { id: "create-interface" });
        })
        .catch((error: Error) => {
          toast.error(error.message, { id: "create-interface" });
        });
    } else {
      toast.error("Current type is missing", { id: "create-interface" });
    }
  }, [context]);

  const display: ListerDisplay = {};

  return (
    <Lister
      key={context.currentType?.interface?.length || 0}
      data={context.currentType?.interface || []}
      loading={false}
    >
      <ListerHeader title="Interface" size="small">
        <ListerHeaderControl>
          <button
            className="rounded-full bg-gray-300 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-lg hover:bg-C1"
            type="button"
            onClick={onClick}
          >
            <Plus size={16} />
          </button>
        </ListerHeaderControl>
      </ListerHeader>
      <ListerContent>
        <ListerContentEmpty>
          <p className="p-3 text-sm text-gray-500 text-center">
            Your type interface is empty. Start by creating a new interface.
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
                <InterfaceBox
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  location={item.location as Position}
                />
              ))}
            </div>
          )}
        />
      </ListerContent>
    </Lister>
  );
}
