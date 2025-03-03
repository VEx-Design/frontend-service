import { NodeProps } from "@xyflow/react";
import { memo, useEffect, useMemo, useState, useCallback } from "react";
import { NodeData } from "@/features/systems/libs/ClassNode/types/AppNode";
import ObjectNodeTemp from "../../../_components/ObjectNodeTemp";
import { useEditor } from "@/features/systems/contexts/EditorContext";
import { useConfig } from "@/features/systems/contexts/ProjectWrapper/ConfigContext";

const NodeComponent = memo((props: NodeProps) => {
  const { configAction, config } = useConfig();
  const { focusNode, setFocusNode } = useEditor();
  const { object } = props.data.data as NodeData;
  const typeId = object?.typeId || "";

  const [objectType, setObjectType] = useState(configAction.getType(typeId));

  // Memoize objectType update only when necessary
  useEffect(() => {
    setObjectType(configAction.getType(typeId));
  }, [config.types, typeId, configAction]);

  // Memoized handleOnClick function
  const handleOnClick = useCallback(() => {
    setFocusNode({
      id: props.id,
      type: props.type,
      data: props.data.data as NodeData,
    });
  }, [props.id, props.type, props.data, setFocusNode]);

  // Memoize isSelect to avoid unnecessary recalculations
  const isSelect = useMemo(
    () => focusNode?.id === props.id,
    [focusNode?.id, props.id]
  );

  return (
    <div className="cursor-pointer" onClick={handleOnClick}>
      <ObjectNodeTemp objectType={objectType} isSelect={isSelect} />
    </div>
  );
});

NodeComponent.displayName = "NodeComponent";

export default NodeComponent;
