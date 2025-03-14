import { NodeProps } from "@xyflow/react";
import { memo, useEffect, useMemo, useState } from "react";
import { NodeData } from "@/features/systems/libs/ClassNode/types/AppNode";
import ObjectNodeTemp from "../../../_components/ObjectNodeTemp";
import { useExecution } from "@/features/systems/contexts/Execution/ExecutionContext";
import { useConfig } from "@/features/systems/contexts/ProjectWrapper/ConfigContext";

const NodeComponent = memo((props: NodeProps) => {
  const { configAction, config } = useConfig();
  const { focusNode, setFocusNode } = useExecution();
  const { object, rotate } = props.data.data as NodeData;
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

  if (!objectType) return null;

  return (
    <div className="cursor-pointer" onClick={handleOnClick}>
      <ObjectNodeTemp
        objectType={objectType}
        isSelect={isSelect}
        rotate={rotate}
        nodeId={props.id}
      />
    </div>
  );
});

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";
