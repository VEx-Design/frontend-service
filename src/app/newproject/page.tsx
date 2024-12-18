"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoIosAddCircle } from "react-icons/io";
import { IoSearchSharp } from "react-icons/io5";
import { RiApps2AddLine } from "react-icons/ri";
import ObjectCard from "../../components/ObjectCard";

const Parameters = [
  {
    Name: "Continuous Wave Laser",
    parameter: {
      laserType: "Continuous Wave",
      wavelength: 532,
      outputPower: 5,
      beamDivergence: 0.5,
      polarization: "Linear",
    },
  },
  {
    Name: "Continuous Wave Laser",
    parameter: {
      laserType: "Continuous Wave",
      wavelength: 532,
      outputPower: 5,
      beamDivergence: 0.5,
      polarization: "Linear",
    },
  },
  {
    Name: "Pulsed Laser",
    parameter: {
      laserType: "Pulsed",
      wavelength: 1064,
      pulseDuration: 10,
      repetitionRate: 1000,
      peakPower: 50,
    },
  },
  {
    Name: "Fiber Laser",
    parameter: {
      laserType: "Fiber Laser",
      wavelength: 1550,
      mode: "Single Mode",
      powerStability: 0.02,
      fiberCoreDiameter: 10,
    },
  },
  {
    Name: "Semiconductor Laser",
    parameter: {
      laserType: "Semiconductor Laser",
      wavelength: 808,
      operatingTemperature: 25,
      lifetime: 50000,
      thresholdCurrent: 0.3,
      efficiency: 0.25,
    },
  },
  {
    Name: "Gas Laser",
    parameter: {
      laserType: "Gas Laser",
      wavelength: 633,
      medium: "Helium-Neon",
      tubeDiameter: 1.5,
      operatingVoltage: 1500,
      beamDiameter: 0.8,
    },
  },
];

function Page() {
  const [popup, setpopup] = useState<boolean>(false);
  const togglepopup = () => {
    setpopup(!popup);
    console.log(popup);
  };

  const closePopup = () => {
    setpopup(false);
  };

  return (
    <div>
      <div>NewProject</div>
      <button onClick={togglepopup}>
        <IoIosAddCircle size={50} />
        {""}
      </button>

      {popup && (
        <div className="bg-black bg-opacity-50 fixed inset-0  flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-[300px] sm:w-[500px] md:w-[800px] h-[600px] relative">
            <div className="bg-C1 text-white rounded-t-lg flex justify-between py-2 px-4 ">
              <h1 className="text-lg flex items-center gap-3">
                <div>
                  <RiApps2AddLine size={22} />
                </div>{" "}
                New Object
              </h1>
              <button>
                <IoClose size={25} onClick={closePopup} /> {""}
              </button>
            </div>
            <div className="p-4 flex flex-col gap-5">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border-2 overflow-hidden w-full">
                <input
                  type="text"
                  placeholder="search object..."
                  className="w-full outline-none bg-transparent text-gray-500"
                />
                <IoSearchSharp size={20} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[470px] overflow-y-auto place-items-center">
                {Parameters.map((parameter, index) => (
                  <ObjectCard
                    key={index}
                    name={parameter.Name}
                    parameter={parameter.parameter}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
