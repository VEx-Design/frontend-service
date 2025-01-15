import Button from "@/components/Button";
import React from "react";

interface EditorNavbarProps {
  title?: string;
}

export default function EditorNavbar(props: EditorNavbarProps) {
  return (
    <div className="flex py-4 px-5 bg-C1 justify-between items-center">
      <p className="text-M1">{props.title || "Untitled"}</p>
      <Button variant="secondary">Save</Button>
    </div>
  );
}
