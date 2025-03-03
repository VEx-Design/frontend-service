'use client'; // Ensures this runs only on the client side

import React, { useEffect, useRef } from 'react';
import { Graph, InternalEvent } from '@maxgraph/core';

const GraphPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Disable the built-in context menu
    InternalEvent.disableContextMenu(containerRef.current);

    // Create the graph
    const graph = new Graph(containerRef.current);
    graph.setPanning(true); // Enable right-click panning

    // Define custom connection points
  //   graph.getConnectionConstraint = (edge, terminal, source) => {
  // if (terminal?.cell) {
  //   const geo = terminal.cell.getGeometry();
  //   if (geo) {
  //     // Calculate the center of the current terminal
  //     const x = geo.x + geo.width / 2;
  //     const y = geo.y + geo.height / 2;

  //     // Get the opposite terminal and its geometry
  //     const otherTerminal = graph.model.getTerminal(edge, !source);
  //     const otherGeo = otherTerminal?.cell?.getGeometry();

  //     if (otherGeo) {
  //       // Calculate the center of the opposite terminal
  //       const otherX = otherGeo.x + otherGeo.width / 2;
  //       const otherY = otherGeo.y + otherGeo.height / 2;

  //       // Determine the connection side based on relative positions
  //       if (Math.abs(x - otherX) > Math.abs(y - otherY)) {
  //         if (x > otherX) {
  //           return new ConnectionConstraint(new Point(0, 0.5), true); // Left middle
  //         } else {
  //           return new ConnectionConstraint(new Point(1, 0.5), true); // Right middle
  //         }
  //       } else {
  //         if (y > otherY) {
  //           return new ConnectionConstraint(new Point(0.5, 0), true); // Top middle
  //         } else {
  //           return new ConnectionConstraint(new Point(0.5, 1), true); // Bottom middle
  //         }
  //       }
  //     }
  //   }
  // }

    // Get the default parent
    const parent = graph.getDefaultParent();

    // Add cells to the model
    graph.batchUpdate(() => {
      const vertex01 = graph.insertVertex({
        parent,
        position: [10, 10],
        size: [100, 100],
        value: 'Object 1',
      });

      const vertex02 = graph.insertVertex({
        parent,
        position: [350, 90],
        size: [200, 200],
        value: 'Object 2',
      });

      const vertex03 = graph.insertVertex({
        parent,
        position: [350, 90],
        size: [100, 150],
        value: 'Object 3',
      });

      graph.insertEdge({
        parent,
        source: vertex01,
        target: vertex02,
        value: 'ray1',
        style: {
          edgeStyle: 'orthogonalEdgeStyle',
        },
      });

      graph.insertEdge({
        parent,
        source: vertex02,
        target: vertex03,
        value: 'ray2',
        style: {
          edgeStyle: 'orthogonalEdgeStyle',
        },
      });
    });

    // Cleanup on component unmount
    return () => {
      graph.destroy();
    };
  }, []);

  return (
    <div>
      <h1>Graph Example</h1>
      <div
        ref={containerRef}
        id="graph-container"
        style={{
          width: '100%',
          height: '500px',
          border: '1px solid black',
          marginTop: '20px',
        }}
      ></div>
    </div>
  );
};

export default GraphPage;
