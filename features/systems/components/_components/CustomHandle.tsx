import { Handle, Position } from "@xyflow/react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
  item: {
    id: string;
    position: Position;
  };
  isSelect?: boolean;
  style?: React.CSSProperties;
}

export default function CustomHandle({ item, style, isSelect }: Props) {
  const iconSize = isSelect ? 20 : 16;
  const strokeWidth = isSelect ? 4 : 3;

  return (
    <>
      {/* Custom Arrow Handle */}
      <div
        className="absolute text-C1"
        style={{
          ...(item.position === Position.Top && {
            left: "50%",
            top: "-10px",
            transform: "translateX(-50%)",
          }),
          ...(item.position === Position.Bottom && {
            left: "50%",
            bottom: "-10px",
            transform: "translateX(-50%)",
          }),
          ...(item.position === Position.Left && {
            top: "50%",
            left: "-10px",
            transform: "translateY(-50%)",
          }),
          ...(item.position === Position.Right && {
            top: "50%",
            right: "-10px",
            transform: "translateY(-50%)",
          }),
          ...style,
        }}
      >
        {item.position === Position.Top && (
          <ArrowDown size={iconSize} strokeWidth={strokeWidth} />
        )}
        {item.position === Position.Bottom && (
          <ArrowUp size={iconSize} strokeWidth={strokeWidth} />
        )}
        {item.position === Position.Left && (
          <ArrowRight size={iconSize} strokeWidth={strokeWidth} />
        )}
        {item.position === Position.Right && (
          <ArrowLeft size={iconSize} strokeWidth={strokeWidth} />
        )}
      </div>

      <Handle
        type="target"
        id={`target-handle-${item.id}`}
        position={item.position}
        className="opacity-0"
        style={{ ...style }}
      />
    </>
  );
}
