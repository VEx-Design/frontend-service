"use client";

//mport { v4 as uuidv4 } from "uuid";
import Canvas from "./_components/canvas/Canvas";
import { useState, useEffect } from "react";
import LeftSidebar from "./_components/sidebar/left-sidebar";
import RightSidebar from "./_components/sidebar/right-sidebar";
import { CanvasProvider } from "./_components/canvas/CanvasContext";

interface CanvasObject {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  imageUrl: string;
  connectedTo: string[];
  isStartNode?: boolean;
}

const FitObject = () => {
  const [objects, setObjects] = useState<CanvasObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<CanvasObject | null>(
    null
  );

  useEffect(() => {
    const mockData: CanvasObject[] = [
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
      },
    ];

    setObjects(mockData);
  }, []);

  return (
    <CanvasProvider>
      <div className="h-full w-screen flex flex-col">
        <main className="flex-1 flex relative">
          <div className="absolute top-0 left-0 h-full z-10">
            <LeftSidebar
              objects={objects}
              selectedObject={selectedObject}
              setSelectedObject={setSelectedObject}
            />
          </div>

          <div className="flex-1 ml-32 md:ml-40 xl:ml-64 mr-32 md:mr-40 xl:mr-64">
            <Canvas
              objects={objects}
              setObjects={setObjects}
              selectedObject={selectedObject}
              setSelectedObject={setSelectedObject}
            />
          </div>

          <div className="absolute top-0 right-0 h-full z-10">
            <RightSidebar
              selectedObject={selectedObject}
              setObjects={setObjects}
            />
          </div>
        </main>
      </div>
    </CanvasProvider>
  );
};

export default FitObject;
