"use client";

import Image from "next/image";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import Input from "@/app/components/_Input/Input";
import { RiStickyNoteAddFill } from "react-icons/ri";
import OwnDropdown from "@/app/components/OwnDropdown";
import AddInput from "@/app/components/_Input/AddInput";
import OpenDropdown from "@/app/components/OpenDropdown";
import SelectInput from "@/app/components/_Input/SelectInput";
// import AssignInput from "@/app/components/_Input/AssignInput";
import ListDisplay from "@/public/icons/DisplayCardIcons/ph_list-light.svg";
import CardDisplay from "@/public/icons/DisplayCardIcons/ri_gallery-view-2.svg";
import { useRouter } from "next/navigation";

interface TitlebarProps {
  title: string;
  buttonAction: "redirect" | "popup";
}

function Titlebar({ title, buttonAction }: TitlebarProps) {
  const [popup, setPopup] = useState<boolean>(false);
  const router = useRouter();

  const handleButtonClick = () => {
    if (buttonAction === "redirect") {
      router.push("/newproject");
    } else if (buttonAction === "popup") {
      setPopup(true);
    }
  };

  function getPopupContent(): React.ReactNode {
    if (title === "Library") {
      return (
        <div className="flex flex-col gap-5">
          <Input
            title={`${title} Name`}
            placeholder="Fill library name"
            type="text"
            onChange={(input) =>
              console.log("input value : ", input.target.value)
            }
          />
          <AddInput
            title={`${title} parameters`}
            placeholder="Insert parameter"
            emptytext="do not have any input yet."
            onChange={(input) =>
              console.log("Addinput value : ", input.target.value)
            }
            onListChange={(list) => console.log("List : ", list)}
          />
        </div>
      );
    } else if (title === "Type") {
      return (
        <div className="flex flex-col gap-5">
          <Input
            title={`${title} Name`}
            placeholder="Fill type name"
            type="text"
          />
          <SelectInput title="Libraries" />
          <AddInput
            title="Local varaiables"
            placeholder="Insert variables"
            emptytext="do not have any input yet."
          />
        </div>
      );
    } else {
      return (
        <div>
          <h2 className="text-xl font-bold mb-4">Default Popup</h2>
          <p>This is the default popup content.</p>
        </div>
      );
    }
  }

  const closePopup = () => {
    setPopup(false);
  };

  return (
    <div>
      <div className="flex flex-none items-center justify-between border-b pb-4">
        <div className="text-H3 font-bold">{title}</div>
        <button
          className="bg-C1 text-white p-2 rounded-lg hover:bg-blue-500"
          onClick={handleButtonClick}
        >
          + {title}
        </button>
      </div>
      <div className="flex flex-none items-end sm:items-center justify-between py-4 flex-col sm:flex-row">
        {/* Swap Display */}
        <div className="flex gap-1">
          <div className="p-2  hover:bg-B1 rounded-md">
            <Image src={CardDisplay} alt="CardIcon" />
          </div>
          <div className="p-2  hover:bg-B1 rounded-md">
            <Image src={ListDisplay} alt="ListIcon" />
          </div>
        </div>
        <div className="flex gap-4">
          <OwnDropdown />
          <OpenDropdown />
        </div>
      </div>

      {/* popup */}
      {popup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white rounded-lg shadow-lg min-w-[300px] max-w-[500px] md:min-w-[500px]">
            <div className="bg-C1 text-white rounded-t-lg flex justify-between py-2 px-4 ">
              <h1 className="text-lg flex items-center gap-3">
                <div>
                  <RiStickyNoteAddFill size={22} />
                </div>{" "}
                New {title}
              </h1>
              <button>
                <IoClose size={25} onClick={closePopup} /> {""}
              </button>
            </div>
            <div className="p-4">
              {getPopupContent()}
              <div className="flex justify-end">
                <button className="bg-C1 hover:bg-blue-500 py-2 px-4 rounded-lg text-white w-fit">
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Titlebar;
