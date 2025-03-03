import { NodeProps } from "@xyflow/react";
import React, { memo, useMemo } from "react";
import { NodeData } from "@/features/systems/libs/ClassNode/types/AppNode";
import ObjectNodeTemp from "../../_components/ObjectNodeTemp";
import { useConfigInterface } from "@/features/systems/contexts/Configuration/ConfigInterfaceContext";
import { useConfig } from "@/features/systems/contexts/ProjectWrapper/ConfigContext";

const NodeComponent = memo((props: NodeProps) => {
  const { configAction } = useConfig();
  const { currentInterface } = useConfigInterface();

  const { object } = props.data.data as NodeData;
  const objectType = useMemo(
    () => configAction.getType(object?.typeId || ""),
    [configAction, object?.typeId]
  );

  return (
    <ObjectNodeTemp
      objectType={objectType}
      currentInterfaceId={currentInterface?.id}
    />
  );
});

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";
