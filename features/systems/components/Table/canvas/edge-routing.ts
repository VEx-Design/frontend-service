import Konva from "konva";
import { Object } from "../Class/object";
import { Edge } from "../Class/edge";
import { Mirror } from "../Class/mirror";

// Calculate object's bounding box considering rotation
export const getObjectBoundingBox = (object: Object) => {
  const { position, size, rotation, referencePosition } = object;

  // Calculate the reference point
  const refX = referencePosition[0] * size.width;
  const refY = referencePosition[1] * size.height;

  // Create a temporary Konva.Rect to calculate the rotated bounds
  const tempRect = new Konva.Rect({
    x: position.x,
    y: position.y,
    width: size.width,
    height: size.height,
    rotation: rotation,
    offset: { x: refX, y: refY },
  });

  // Get the bounding box
  const box = tempRect.getClientRect();

  return {
    x: box.x,
    y: box.y,
    width: box.width,
    height: box.height,
  };
};

// Get interface position in scene coordinates
export const getInterfacePosition = (
  objects: Object[],
  objectId: string,
  interfaceId: string
) => {
  const object = objects.find((obj) => obj.id === objectId);
  if (!object) return null;

  const interfacePosition = object.interfacePositions.get(interfaceId);
  if (!interfacePosition) return null;

  const refX = object.referencePosition[0] * object.size.width;
  const refY = object.referencePosition[1] * object.size.height;

  const objectX = object.position.x;
  const objectY = object.position.y;
  const objectRotation = object.rotation;

  const interfaceX = interfacePosition[0] * object.size.width;
  const interfaceY = interfacePosition[1] * object.size.height;

  // Rotate the interface position around the object's reference point
  const angleInRadians = (objectRotation * Math.PI) / 180;
  const rotatedX =
    Math.cos(angleInRadians) * (interfaceX - refX) -
    Math.sin(angleInRadians) * (interfaceY - refY) +
    refX;
  const rotatedY =
    Math.sin(angleInRadians) * (interfaceX - refX) +
    Math.cos(angleInRadians) * (interfaceY - refY) +
    refY;

  return {
    x: objectX + rotatedX - refX,
    y: objectY + rotatedY - refY,
  };
};

// Calculate Manhattan distance between two points
export const calculateManhattanDistance = (
  p1: { x: number; y: number },
  p2: { x: number; y: number }
) => {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
};

// Generate orthogonal path points between two interface points
export const generateOrthogonalPath = (
  objects: Object[],
  start: { x: number; y: number },
  end: { x: number; y: number }
) => {
  // Check if either end is connected to a mirror
  const isMirrorInterface = (pos: { x: number; y: number }) => {
    return objects.some((obj) => {
      if (!obj.isMirror) return false;

      const interfacePos = getInterfacePosition(objects, obj.id, "in");
      if (!interfacePos) return false;

      return (
        Math.abs(interfacePos.x - pos.x) < 5 &&
        Math.abs(interfacePos.y - pos.y) < 5
      );
    });
  };

  const startIsMirror = isMirrorInterface(start);
  const endIsMirror = isMirrorInterface(end);

  // Always use orthogonal paths, even with mirrors
  // Option 1: Vertical first, then horizontal
  const path1 = [start.x, start.y, start.x, end.y, end.x, end.y];

  // Option 2: Horizontal first, then vertical
  const path2 = [start.x, start.y, end.x, start.y, end.x, end.y];

  // Get all mirror objects to avoid their bounding boxes
  const mirrors = objects.filter((obj) => obj.isMirror);
  const mirrorBoxes = mirrors.map((mirror) => getObjectBoundingBox(mirror));

  // Check if a path segment intersects with any mirror bounding box
  const intersectsWithMirror = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    return mirrorBoxes.some((box) => {
      // Simple line-rectangle intersection check
      // For vertical lines
      if (x1 === x2) {
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        return (
          x1 >= box.x &&
          x1 <= box.x + box.width &&
          maxY >= box.y &&
          minY <= box.y + box.height
        );
      }
      // For horizontal lines
      if (y1 === y2) {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        return (
          y1 >= box.y &&
          y1 <= box.y + box.height &&
          maxX >= box.x &&
          minX <= box.x + box.width
        );
      }
      return false;
    });
  };

  // Check if paths intersect with mirrors
  const path1Intersects =
    intersectsWithMirror(path1[0], path1[1], path1[2], path1[3]) ||
    intersectsWithMirror(path1[2], path1[3], path1[4], path1[5]);

  const path2Intersects =
    intersectsWithMirror(path2[0], path2[1], path2[2], path2[3]) ||
    intersectsWithMirror(path2[2], path2[3], path2[4], path2[5]);

  // If neither path intersects, choose the shorter one
  if (!path1Intersects && !path2Intersects) {
    // Prefer vertical first as default
    return path1;
  }

  // If only one path doesn't intersect, use that one
  if (!path1Intersects) return path1;
  if (!path2Intersects) return path2;

  // If both paths intersect, try a more complex path with two turns
  const offset = 30; // Offset distance to go around objects
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    // If horizontal distance is greater, go vertical first with offset
    const offsetY = dy > 0 ? start.y - offset : start.y + offset;
    const path3 = [
      start.x,
      start.y,
      start.x,
      offsetY,
      end.x,
      offsetY,
      end.x,
      end.y,
    ];

    const path3Intersects =
      intersectsWithMirror(path3[0], path3[1], path3[2], path3[3]) ||
      intersectsWithMirror(path3[2], path3[3], path3[4], path3[5]) ||
      intersectsWithMirror(path3[4], path3[5], path3[6], path3[7]);

    if (!path3Intersects) return path3;
  } else {
    // If vertical distance is greater, go horizontal first with offset
    const offsetX = dx > 0 ? start.x - offset : start.x + offset;
    const path3 = [
      start.x,
      start.y,
      offsetX,
      start.y,
      offsetX,
      end.y,
      end.x,
      end.y,
    ];

    const path3Intersects =
      intersectsWithMirror(path3[0], path3[1], path3[2], path3[3]) ||
      intersectsWithMirror(path3[2], path3[3], path3[4], path3[5]) ||
      intersectsWithMirror(path3[4], path3[5], path3[6], path3[7]);

    if (!path3Intersects) return path3;
  }

  // If all else fails, use the original path (vertical first)
  return path1;
};
