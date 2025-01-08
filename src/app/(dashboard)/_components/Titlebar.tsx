"use client";

import Image from "next/image";
import React, { useState } from "react";
import TypeForm from "./form/TypeForm";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";
import LibraryForm from "./form/LibraryForm";
import { RiStickyNoteAddFill } from "react-icons/ri";
import FilterDropdown from "@/src/components/dropdown/FilterDropdown";
import SortDropdown from "@/src/components/dropdown/SortDropdown";
import ListDisplay from "@/public/icons/DisplayCardIcons/ph_list-light.svg";
import CardDisplay from "@/public/icons/DisplayCardIcons/ri_gallery-view-2.svg";

interface TitlebarProps {
  title: string;
  buttonAction: "redirect" | "popup";
  currentView: "card" | "list";
  onViewChange: (view: "card" | "list") => void;
  onFilterChange: (option: "All" | "Own by me" | "Own by anyone") => void;
  onSortChange: (
    option: "Last Modified" | "Created on" | "A - Z" | "Z - A"
  ) => void;
}

function Titlebar({
  title,
  buttonAction,
  currentView,
  onViewChange,
  onFilterChange,
  onSortChange,
}: TitlebarProps) {
  const router = useRouter();
  const [popup, setPopup] = useState<boolean>(false);

  const handleButtonClick = () => {
    if (buttonAction === "redirect") {
      router.push("/board");
    } else if (buttonAction === "popup") {
      setPopup(true);
    }
  };

  function getPopupContent(): React.ReactNode {
    if (title === "Library") {
      return <LibraryForm onSubmit={closePopup} />;
    } else if (title === "Type") {
      return <TypeForm onSubmit={closePopup} />;
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
    <div className="flex flex-col gap-2 pb-4">
      <div className="flex flex-none items-center justify-between border-b pb-2">
        <div className="text-lg font-bold">{title}</div>
        <button
          className="bg-C1 text-white p-2 rounded-lg hover:bg-blue-500"
          onClick={handleButtonClick}
        >
          + {title}
        </button>
      </div>
      <div className="flex flex-none items-end sm:items-center justify-between flex-col sm:flex-row">
        {/* Swap Display */}
        <div className="flex gap-1">
          <div
            className={`p-1  hover:bg-B1 rounded-md transition delay-75 aspect-square w-6 h-6 ${
              currentView === "card" ? "bg-B1" : ""
            }`}
            onClick={() => onViewChange("card")}
          >
            <Image src={CardDisplay} alt="CardIcon" />
          </div>
          <div
            className={`p-1  hover:bg-B1 rounded-md transition delay-75 aspect-square w-6 h-6 ${
              currentView === "list" ? "bg-B1" : ""
            }`}
            onClick={() => onViewChange("list")}
          >
            <Image src={ListDisplay} alt="ListIcon" />
          </div>
        </div>
        <div className="flex gap-4">
          <FilterDropdown onFilterChange={onFilterChange} />
          <SortDropdown onSortChange={onSortChange} />
        </div>
      </div>

      {/* popup */}
      {popup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white rounded-lg shadow-lg w-[300px] sm:w-[400px] md:w-[500px] min-h-[600px]">
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
            <div className="p-4 h-[555px]">{getPopupContent()}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Titlebar;
