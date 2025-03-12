// Calculate the best orthogonal path between two points
export function calculateOrthogonalPath(
    start: { x: number; y: number },
    end: { x: number; y: number },
    objects: Array<{
      position: { x: number; y: number }
      size: { width: number; height: number }
      rotation: number
      referencePosition: [number, number]
    }>,
    padding = 10,
  ) {
    // Simple L-shaped path (horizontal then vertical)
    const horizontalFirst = [start.x, start.y, end.x, start.y, end.x, end.y]
  
    // Simple L-shaped path (vertical then horizontal)
    const verticalFirst = [start.x, start.y, start.x, end.y, end.x, end.y]
  
    // Calculate Manhattan distance for both paths
    const horizontalFirstDistance = Math.abs(end.x - start.x) + Math.abs(end.y - start.y)
    const verticalFirstDistance = horizontalFirstDistance // Same distance for Manhattan
  
    // For now, we'll use the vertical-first approach as default
    // In a more advanced implementation, you could check which path avoids obstacles better
    return verticalFirst
  }
  
  // Calculate Manhattan distance between two points
  export function calculateManhattanDistance(p1: { x: number; y: number }, p2: { x: number; y: number }) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y)
  }
  
  