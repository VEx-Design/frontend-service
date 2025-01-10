"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const [popup, setPopup] = useState(false);
  const [width, setWidth] = useState<string | number>("");
  const [height, setHeight] = useState<string | number>("");
  const router = useRouter();

  const openPopup = () => setPopup(true);
  const closePopup = () => setPopup(false);

  const handleDone = () => {
    const numericWidth = Number(width);
    const numericHeight = Number(height);

    if (numericWidth > 0 && numericHeight > 0) {
      router.push(`/fitobject?width=${numericWidth}&height=${numericHeight}`);
    } else {
      alert("Please enter valid dimensions!");
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
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Width:
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  placeholder="Enter width"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Height:
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  placeholder="Enter height"
                />
              </div>
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
