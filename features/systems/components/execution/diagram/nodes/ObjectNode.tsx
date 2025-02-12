import { NodeProps } from "@xyflow/react";
import { memo, useEffect, useMemo, useState } from "react";
import { NodeData } from "@/features/systems/libs/ClassNode/types/AppNode";
import { useProject } from "@/features/systems/contexts/ProjectContext";
import ObjectNodeTemp from "../../../_components/ObjectNodeTemp";
import { useExecution } from "@/features/systems/contexts/ExecutionContext";

const NodeComponent = memo((props: NodeProps) => {
  const { configAction, config } = useProject();
  const { focusNode, setFocusNode } = useExecution();
  const { object } = props.data.data as NodeData;
  const typeId = object?.typeId || "";

  const [objectType, setObjectType] = useState(() =>
    configAction.getType(typeId)
  );

  useEffect(() => {
    setObjectType(configAction.getType(typeId));
  }, [config.types, typeId, configAction]);

  const handleOnClick = () => {
    setFocusNode({
      id: props.id,
      type: props.type,
      data: props.data.data as NodeData,
    });
  };

  const isSelect = useMemo(
    () => focusNode?.id === props.id,
    [focusNode, props.id]
  );

  return (
    <div className="cursor-pointer" onClick={handleOnClick}>
      <ObjectNodeTemp objectType={objectType} isSelect={isSelect} />
    </div>
  );
});

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";
