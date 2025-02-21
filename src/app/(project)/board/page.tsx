"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { setCanvasDimensions } from "../../fitobject/_components/canvas/CanvasContext";

const HomePage = () => {
  const [popup, setPopup] = useState(false);
  // dimensions
  const [width, setWidth] = useState<string | number>("");
  const [height, setHeight] = useState<string | number>("");
  //units
  const [unit, setUnit] = useState("cm");
  //positions
  const [startX, setStartX] = useState<string | number>("0");
  const [startY, setStartY] = useState<string | number>("0");

  const router = useRouter();

  const openPopup = () => setPopup(true);
  const closePopup = () => setPopup(false);

  const handleDone = () => {
    const numericWidth = Number(width);
    const numericHeight = Number(height);
    const numericStartX = Number(startX);
    const numericStartY = Number(startY);

    if (
      numericWidth > 0 &&
      numericHeight > 0 &&
      numericStartX >= 0 &&
      numericStartY >= 0 &&
      numericStartX <= numericWidth &&
      numericStartY <= numericHeight
    ) {
      setCanvasDimensions(numericWidth, numericHeight);
      localStorage.setItem(
        "startNodePosition",
        JSON.stringify({ x: numericStartX, y: numericStartY })
      );

      router.push("/fitobject");
    } else {
      alert("Please enter valid dimensions and start position!");
    }
  };

  return (
    <div className="h-full flex justify-center items-center">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        onClick={openPopup}
      >
        Fit to space
      </button>
      {popup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white rounded-lg shadow-lg w-[300px] sm:w-[400px] md:w-[500px]">
            <div className="bg-C1 text-white rounded-t-lg flex justify-between py-2 px-4">
              <h1 className="text-lg flex items-center gap-3">Fit to space</h1>
              <button>
                <IoClose size={25} onClick={closePopup} />
                {}
              </button>
            </div>
            <div className="p-4">
              {/* Width Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Width:
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Enter width"
                  />
                  <select
                    aria-label="select unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md"
                  >
                    <option value="mm">mm</option>
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                  </select>
                </div>
              </div>

              {/* Height Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Height:
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Enter height"
                  />
                  <select
                    aria-label="select unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md"
                  >
                    <option value="mm">mm</option>
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                  </select>
                </div>
              </div>

              {/* Start X & Y Position */}
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start X Position:
                  </label>
                  <input
                    type="number"
                    value={startX}
                    onChange={(e) => setStartX(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Start X"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Y Position:
                  </label>
                  <input
                    type="number"
                    value={startY}
                    onChange={(e) => setStartY(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Start Y"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleDone}
                className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
