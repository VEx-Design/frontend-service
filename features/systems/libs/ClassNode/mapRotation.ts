import { Interface } from "../ClassInterface/types/Interface";
import { Position } from "@xyflow/react";

export default function mapRotation(
  interfaces: Interface[],
  rotation: 90 | 180 | 270 | 0
): Interface[] {
  return interfaces.map((inter) => {
    const newInter = { ...inter };

    const rotationMap = {
      [Position.Top]: {
        90: Position.Right,
        180: Position.Bottom,
        270: Position.Left,
      },
      [Position.Right]: {
        90: Position.Bottom,
        180: Position.Left,
        270: Position.Top,
      },
      [Position.Bottom]: {
        90: Position.Left,
        180: Position.Top,
        270: Position.Right,
      },
      [Position.Left]: {
        90: Position.Top,
        180: Position.Right,
        270: Position.Bottom,
      },
    };

    newInter.position =
      rotation !== 0
        ? rotationMap[inter.position]?.[rotation] ?? inter.position
        : inter.position;

    return newInter;
  });
}
