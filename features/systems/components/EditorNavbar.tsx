import Button from "@/components/Button";
import React from "react";

export default function EditorNavbar() {
  return (
    <div className="flex py-4 px-5 bg-C1 justify-between items-center">
      <p className="text-M1">Untitled</p>
      <Button title="Save" />
    </div>
  );
}
