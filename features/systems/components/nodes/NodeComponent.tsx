import { NodeProps, useReactFlow } from "@xyflow/react";
import { memo } from "react";
import NodeCard from "./NodeCard";
import { Badge } from "@/components/ui/badge";
import NodeImage from "./NodeImage";
import { AppNode } from "../../types/appNode";

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";

const NodeComponent = memo((props: NodeProps) => {
  const { getNode } = useReactFlow();
  const node = getNode(props.id) as AppNode;

  // Debugging in development mode
  if (DEV_MODE) {
    console.log(`Rendering NodeComponent for ID: ${props.id}`, props);
  }

  if (!node?.data) {
    console.warn(`Node data is missing for ID: ${props.id}`);
    return null; // or render a placeholder/fallback
  } else {
    console.log(node?.data?.img);
  }

  return (
    <NodeCard nodeId={props.id}>
      {DEV_MODE && <Badge>DEV:{props.id}</Badge>}
      <NodeImage
        imageUrl={node?.data?.img || "/images/Logo.png"}
        isSelected={!!props.selected}
      />
    </NodeCard>
  );
});

NodeComponent.displayName = "NodeComponent";

export default NodeComponent;
