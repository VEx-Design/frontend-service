import React from "react";

interface Props {
  title: string;
  handleButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button(props: Props) {
  return (
    <button
      className="bg-orange-500 text-sm text-white px-5 py-2 rounded-lg"
      onClick={props.handleButtonClick}
    >
      {props.title}
    </button>
  );
}
