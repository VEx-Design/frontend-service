import React, { useEffect, useState } from "react";
import { IoCloseCircle } from "react-icons/io5";

interface AddInputProps {
  title: string;
  placeholder: string;
  onListChange?: (list: string[]) => void;
  errorMessage?: string;
  hasError?: boolean;
}

function AddInput({
  title,
  placeholder,
  onListChange,
  errorMessage,
  hasError,
}: AddInputProps) {
  const [parameterList, setParameterList] = useState<string[]>([]);
  const [NewParameter, setNewParameter] = useState<string>("");

  const AddList = () => {
    if (NewParameter.trim() === "") {
      alert("Parameter cannot be empty");
    } else {
      const updatedList = [...parameterList, NewParameter];
      setParameterList(updatedList);
      setNewParameter("");
      // เรียก onListChange เพื่อส่งข้อมูลกลับไปที่ Parent Component
      if (onListChange) {
        onListChange(updatedList);
      }
    }
  };

  const RemoveList = (index: number) => {
    const newTasks = parameterList.filter((_, i) => i !== index);
    setParameterList(newTasks);
    // เรียก onListChange เพื่อส่งข้อมูลกลับไปที่ Parent Component
    if (onListChange) {
      onListChange(newTasks);
    }
  };

  useEffect(() => {
    if (onListChange) {
      // ตรวจสอบว่า parameterList เปลี่ยนแปลงจริงๆ ก่อนที่จะเรียก onListChange
      const currentList = [...parameterList];
      if (
        currentList.length !== parameterList.length ||
        !currentList.every((item, i) => item === parameterList[i])
      ) {
        onListChange(parameterList);
      }
    }
  }, [parameterList, onListChange]);

  return (
    <div
      className={`flex flex-col gap-3 ${
        hasError ? "border-l-2 border-red-500 pl-4" : ""
      }`}
    >
      <label htmlFor={`${title}`}>{title}</label>
      <div className="flex ">
        <input
          type="text"
          id={`${title}`}
          className={`rounded-l-md p-2 flex-1 ${
            hasError
              ? "border-2 border-red-500 placeholder-red-500 "
              : "border-2"
          }`}
          placeholder={placeholder}
          value={NewParameter}
          onChange={(e) => setNewParameter(e.target.value)} // แก้ไขการป้อนข้อมูลใน input
          onKeyDown={(press) => {
            if (press.key === "Enter") {
              AddList();
            }
          }}
        />
        <button
          className={` text-white ${
            hasError
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gray-300 hover:bg-gray-400"
          } px-3 rounded-r-md`}
          onClick={AddList}
        >
          Add
        </button>
      </div>
      {/* {parameterList.length === 0 && (
        <span className="text-xs text-gray-400 pl-1">{emptytext}</span>
      )} */}
      {parameterList.length > 0 && (
        <ul className="flex flex-wrap gap-4">
          {parameterList.map((list, index) => (
            <li
              key={index}
              className="bg-B2 px-3 py-1 rounded-full w-fit flex items-center gap-2"
            >
              {list}
              <button>
                <IoCloseCircle size={20} onClick={() => RemoveList(index)} />
                {""}
              </button>
            </li>
          ))}
        </ul>
      )}
      {errorMessage && (
        <span className="text-xs text-red-500">{errorMessage}</span>
      )}
    </div>
  );
}

export default AddInput;
