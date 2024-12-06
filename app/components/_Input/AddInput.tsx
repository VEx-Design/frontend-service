import React, { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";

interface AddInputProps {
  title: string;
  placeholder: string;
  emptytext: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onListChange?: (list: string[]) => void;
}

function AddInput({
  title,
  placeholder,
  emptytext,
  onChange,
  onListChange,
}: AddInputProps) {
  const [parameterList, setParameterList] = useState<string[]>([]);
  const [NewParameter, setNewParameter] = useState<string>("");

  const AddList = () => {
    if (NewParameter.trim() === "") {
      alert("Not can be empty");
    } else {
      const updatedList = [...parameterList, NewParameter];
      setParameterList(updatedList);
      setNewParameter("");
      if (onListChange) {
        onListChange(updatedList);
      }
    }
  };

  const RemoveList = (index: number) => {
    const newTasks = parameterList.filter((_, i) => i !== index);
    setParameterList(newTasks);
  };

  return (
    <div>
      <div className="flex flex-col gap-3">
        <label htmlFor={`${title}`}>{title}</label>
        <div className="flex ">
          <input
            type="text"
            id={`${title}`}
            className="border-2 rounded-l-md p-2 flex-1"
            placeholder={placeholder}
            value={NewParameter}
            onChange={(input) => {
              setNewParameter(input.target.value);
              if (onChange) {
                onChange(input);
              }
            }}
            onKeyDown={(press) => {
              if (press.key === "Enter") {
                AddList();
              }
            }}
          />
          <button
            className="bg-gray-300 text-white hover:bg-gray-400 px-3 rounded-r-md"
            onClick={AddList}
          >
            Add
          </button>
        </div>
        {parameterList.length === 0 && (
          <span className="text-xs text-gray-400 pl-1">{emptytext}</span>
        )}
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
      </div>
    </div>
  );
}

export default AddInput;
