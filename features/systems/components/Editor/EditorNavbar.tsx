import Button from "@/components/Button";
import { Loader2 } from "lucide-react";
import React from "react";

interface EditorNavbarProps {
  title?: string;
  onSave?: () => void;
  savePending?: boolean;
}

export default function EditorNavbar(props: EditorNavbarProps) {
  return (
    <div className="flex py-4 px-5 bg-C1 justify-between items-center">
      <p className="text-M1">{props.title || "Untitled"}</p>
      <div className="flex gap-2">
        <Button variant="secondary" handleButtonClick={props.onSave}>
          {!props.savePending && "Save"}
          {props.savePending && <Loader2 className="animate-spin" />}
        </Button>
        <Button variant="sensitive">{"Execute"}</Button>
      </div>
    </div>
  );
}
