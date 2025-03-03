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
import { Plus } from "lucide-react";
import { toast } from "sonner";
import InterfaceBox from "./InterfaceBox";
import { Position } from "@xyflow/react";
import { useConfig } from "@/features/systems/contexts/Configuration/ConfigContext";
import { useConfigInterface } from "@/features/systems/contexts/Configuration/ConfigInterfaceContext";

export default function InterfaceLister() {
  const { currentType } = useConfig();
  const { interfaceAction } = useConfigInterface();

  const onClick = useCallback(() => {
    interfaceAction.addInterface();
    toast.success("Interface Created!", { id: "create-interface" });
  }, [interfaceAction]);

  const display: ListerDisplay = {};

  return (
    <Lister
      key={currentType?.interfaces?.length || 0}
      data={currentType?.interfaces || []}
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
          <div className="flex flex-1 flex-col ">
            <p className="p-3 text-sm text-gray-500 text-center">
              Your type interface is empty. Start by creating a new interface.
            </p>
          </div>
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
                  key={item.id?.toString()}
                  id={item.id?.toString()}
                  name={item.name?.toString()}
                  position={item.position as Position}
                />
              ))}
            </div>
          )}
        />
      </ListerContent>
    </Lister>
  );
}
