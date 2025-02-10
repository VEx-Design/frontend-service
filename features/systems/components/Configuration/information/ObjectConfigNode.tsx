import { NodeProps } from "@xyflow/react";
import React, { memo, useMemo } from "react";
import { useConfig } from "@/features/systems/contexts/ConfigContext";
import { NodeData } from "@/features/systems/libs/ClassNode/types/AppNode";
import { useProject } from "@/features/systems/contexts/ProjectContext";
import ObjectNodeTemp from "../../_components/ObjectNodeTemp";

const NodeComponent = memo((props: NodeProps) => {
  const { configAction } = useProject();
  const { currentInterface } = useConfig();

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
