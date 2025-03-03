"use client";

//import { v4 as uuidv4 } from "uuid";
import Canvas from "./_components/canvas/Canvas";
import LeftSidebar from "./_components/sidebar/left-sidebar";
import RightSidebar from "./_components/sidebar/right-sidebar";
import { CanvasProvider } from "./_components/canvas/CanvasContext";
import { useEffect, useState } from "react";

const FitObject = () => {
  const mockData = [
    {
      id: "6a3ec60f-fc1b-4db5-8eee-b2d85e70b31b",
      name: "Convex Lens",
      x: 10,
      y: 50,
      width: 80,
      height: 40,
      fill: "gray",
      imageUrl:
        "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fA%3D%3D",
      connectedTo: ["5d927aa4-8cfd-4b07-bb8d-2319d14b4657"],
      isStartNode: true,
      referencePosition: [0.5, 0.5],
    },
    {
      id: "5d927aa4-8cfd-4b07-bb8d-2319d14b4657",
      name: "Concave Mirror",
      x: 120,
      y: 70,
      width: 100,
      height: 60,
      fill: "gray",
      imageUrl: "https://konvajs.org/assets/yoda.jpg",
      connectedTo: ["d9a5c312-39d6-4366-af76-20f8529779be"],
      isStartNode: false,
      referencePosition: [0.5, 0.5],
    },
    {
      id: "d9a5c312-39d6-4366-af76-20f8529779be",
      name: "Prism",
      x: 260,
      y: 90,
      width: 100,
      height: 50,
      fill: "gray",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-C_UAhXq9GfuGO452EEzfbKnh1viQB9EDBQ&s",
      connectedTo: ["1a57d617-5bc9-4a67-a41d-98b2dc4759ac"],
      isStartNode: false,
      referencePosition: [0.5, 0.5],
    },
    {
      id: "1a57d617-5bc9-4a67-a41d-98b2dc4759ac",
      name: "Beam Splitter",
      x: 380,
      y: 110,
      width: 100,
      height: 100,
      fill: "gray",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmCy16nhIbV3pI1qLYHMJKwbH2458oiC9EmA&s",
      connectedTo: [],
      isStartNode: false,
      referencePosition: [0.5, 0.5],
    },
  ];

  const [canvasSize, setCanvasSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    // const loaded = localStorage.getItem("CanvasDimensions");
    // if (loaded) {
    //   const { width, height } = JSON.parse(loaded);
      setCanvasSize({ width:1000, height:1000 });
    // }
  }, []);

  if (!canvasSize)
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );

    return (
      <div className="flex flex-1 w-full h-full">
      <CanvasProvider initialObjects={mockData} initialCanvasSize={canvasSize}>
        <div className="flex flex-1 flex-col h-full w-full">
          <main className="flex flex-1 w-full h-full">
            {/* Left sidebar with fixed width */}
            <div className="h-full shrink-0">
              <LeftSidebar />
            </div>
  
            {/* Canvas that fills available space */}
            <div className="flex-1 h-full overflow-hidden">
              <Canvas />
            </div>
  
            {/* Right sidebar with fixed width */}
            <div className="h-full shrink-0">
              <RightSidebar />
            </div>
          </main>
        </div>
      </CanvasProvider>
      </div>
    )
};

export default FitObject;
