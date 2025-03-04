interface Point {
    x: number
    y: number
  }
  
  interface Obstacle {
    x: number
    y: number
    width: number
    height: number
    rotation?: number
  }
  
  /**
   * Calculate the bounding box of a rotated rectangle
   */
  function getRotatedBoundingBox(obstacle: Obstacle): { minX: number; minY: number; maxX: number; maxY: number } {
    const { x, y, width, height, rotation = 0 } = obstacle
  
    // If no rotation, return the regular bounding box
    if (rotation === 0 || rotation === 360) {
      return {
        minX: x,
        minY: y,
        maxX: x + width,
        maxY: y + height,
      }
    }
  
    // Convert rotation to radians
    const radians = (rotation * Math.PI) / 180
    const cos = Math.cos(radians)
    const sin = Math.sin(radians)
  
    // Calculate the four corners of the rotated rectangle
    const centerX = x + width / 2
    const centerY = y + height / 2
  
    const halfWidth = width / 2
    const halfHeight = height / 2
  
    const corners = [
      { x: -halfWidth, y: -halfHeight },
      { x: halfWidth, y: -halfHeight },
      { x: halfWidth, y: halfHeight },
      { x: -halfWidth, y: halfHeight },
    ].map((corner) => {
      // Rotate the corner
      const rotatedX = corner.x * cos - corner.y * sin
      const rotatedY = corner.x * sin + corner.y * cos
  
      // Translate back to world coordinates
      return {
        x: centerX + rotatedX,
        y: centerY + rotatedY,
      }
    })
  
    // Find the min and max coordinates
    const xs = corners.map((c) => c.x)
    const ys = corners.map((c) => c.y)
  
    return {
      minX: Math.min(...xs),
      minY: Math.min(...ys),
      maxX: Math.max(...xs),
      maxY: Math.max(...ys),
    }
  }
  
  /**
   * Check if a line segment intersects with an obstacle
   */
  function lineIntersectsObstacle(start: Point, end: Point, obstacle: Obstacle): boolean {
    const bbox = getRotatedBoundingBox(obstacle)
  
    // Simple bounding box check for efficiency
    const lineMinX = Math.min(start.x, end.x)
    const lineMaxX = Math.max(start.x, end.x)
    const lineMinY = Math.min(start.y, end.y)
    const lineMaxY = Math.max(start.y, end.y)
  
    // If the bounding boxes don't overlap, there's no intersection
    if (lineMaxX < bbox.minX || lineMinX > bbox.maxX || lineMaxY < bbox.minY || lineMinY > bbox.maxY) {
      return false
    }
  
    // For non-rotated obstacles, we can do a more precise check
    if (!obstacle.rotation || obstacle.rotation % 90 === 0) {
      // Vertical line
      if (start.x === end.x) {
        return (
          start.x >= bbox.minX &&
          start.x <= bbox.maxX &&
          ((start.y <= bbox.maxY && end.y >= bbox.minY) || (end.y <= bbox.maxY && start.y >= bbox.minY))
        )
      }
  
      // Horizontal line
      if (start.y === end.y) {
        return (
          start.y >= bbox.minY &&
          start.y <= bbox.maxY &&
          ((start.x <= bbox.maxX && end.x >= bbox.minX) || (end.x <= bbox.maxX && start.x >= bbox.minX))
        )
      }
    }
  
    // For rotated obstacles or diagonal lines, we use the bounding box check as an approximation
    // A more precise check would involve line-polygon intersection tests
    return true
  }
  
  /**
   * Calculate an orthogonal path between two points, avoiding obstacles
   */
  export function calculateOrthogonalPath(start: Point, end: Point, obstacles: Obstacle[]): Point[] {
    // If start and end are aligned horizontally or vertically, try direct path first
    if (start.x === end.x || start.y === end.y) {
      const directPath = [start, end]
      const hasIntersection = obstacles.some((obstacle) => lineIntersectsObstacle(start, end, obstacle))
  
      if (!hasIntersection) {
        return directPath
      }
    }
  
    // Try a simple 3-point path (two segments)
    // First try going horizontal then vertical
    const midPoint1 = { x: end.x, y: start.y }
    const path1 = [start, midPoint1, end]
  
    const hasIntersection1 =
      obstacles.some((obstacle) => lineIntersectsObstacle(start, midPoint1, obstacle)) ||
      obstacles.some((obstacle) => lineIntersectsObstacle(midPoint1, end, obstacle))
  
    if (!hasIntersection1) {
      return path1
    }
  
    // Then try going vertical then horizontal
    const midPoint2 = { x: start.x, y: end.y }
    const path2 = [start, midPoint2, end]
  
    const hasIntersection2 =
      obstacles.some((obstacle) => lineIntersectsObstacle(start, midPoint2, obstacle)) ||
      obstacles.some((obstacle) => lineIntersectsObstacle(midPoint2, end, obstacle))
  
    if (!hasIntersection2) {
      return path2
    }
  
    // If both simple paths have intersections, try a more complex path with 3 segments
    const midX = (start.x + end.x) / 2
    const midPoint3 = { x: midX, y: start.y }
    const midPoint4 = { x: midX, y: end.y }
    const path3 = [start, midPoint3, midPoint4, end]
  
    const hasIntersection3 =
      obstacles.some((obstacle) => lineIntersectsObstacle(start, midPoint3, obstacle)) ||
      obstacles.some((obstacle) => lineIntersectsObstacle(midPoint3, midPoint4, obstacle)) ||
      obstacles.some((obstacle) => lineIntersectsObstacle(midPoint4, end, obstacle))
  
    if (!hasIntersection3) {
      return path3
    }
  
    // If all paths have intersections, return the original path as a fallback
    // In a real implementation, you might want to use a more sophisticated algorithm
    // like A* pathfinding with a grid
    return path1
  }
  
  const getAbsoluteInterfacePosition = (obj: any, interfacePos: [number, number]) => {
    const [relX, relY] = interfacePos
    const radians = ((obj.rotation || 0) * Math.PI) / 180
    const refX = obj.width * (obj.referencePosition?.[0] || 0.5)
    const refY = obj.height * (obj.referencePosition?.[1] || 0.5)
  
    // Calculate position relative to reference point
    const relativeToRef = {
      x: obj.width * relX - refX,
      y: obj.height * relY - refY,
    }
  
    // Apply rotation around reference point
    const rotatedX = relativeToRef.x * Math.cos(radians) - relativeToRef.y * Math.sin(radians)
    const rotatedY = relativeToRef.x * Math.sin(radians) + relativeToRef.y * Math.cos(radians)
  
    // Calculate absolute position
    return {
      x: obj.x + refX + rotatedX,
      y: obj.y + refY + rotatedY,
    }
  }
  
  