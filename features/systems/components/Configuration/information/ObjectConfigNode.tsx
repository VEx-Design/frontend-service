import { NodeProps } from "@xyflow/react";
import React, { memo, useMemo } from "react";
import { NodeData } from "@/features/systems/libs/ClassNode/types/AppNode";
import { useProject } from "@/features/systems/contexts/ProjectContext";
import ObjectNodeTemp from "../../_components/ObjectNodeTemp";
import { useConfigInterface } from "@/features/systems/contexts/ConfigInterfaceContext";

const NodeComponent = memo((props: NodeProps) => {
  const { configAction } = useProject();
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
