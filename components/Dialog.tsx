"use client";

import getChildren from "@/lib/getChildren";
import React, { createContext, useState, useContext, useMemo } from "react";
import { IoClose } from "react-icons/io5";
import { RiStickyNoteAddFill } from "react-icons/ri";
import Button from "./Button";

const DialogContext = createContext<{
  openDialog: () => void;
  closeDialog: () => void;
} | null>(null);

interface DialogProps {
  title: string;
  onClose?: () => void;
  children: React.ReactNode;
}

export function Dialog(props: DialogProps) {
  const [isOpen, setOpen] = useState(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => {
    setOpen(false);
    props.onClose?.();
  };

  const trigger = useMemo(
    () => getChildren(props.children, DialogTrigger),
    [props.children]
  );

  const content = useMemo(
    () => getChildren(props.children, DialogContent),
    [props.children]
  );

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {trigger}

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white rounded-lg shadow-lg min-w-[300px] max-w-[500px] md:min-w-[500px]">
            <div className="bg-C1 text-white rounded-t-lg flex justify-between py-2 px-4 ">
              <h1 className="text-lg flex items-center gap-3">
                <div>
                  <RiStickyNoteAddFill size={22} />
                </div>{" "}
                {props.title}
              </h1>
              <button>
                <IoClose size={25} onClick={closeDialog} /> {""}
              </button>
            </div>
            <div className="p-4">{content}</div>
            <div className="p-4">
              <div className="flex justify-end">
                <Button>Create</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}

interface DialogTriggerProps {
  children: React.ReactNode;
}

export function DialogTrigger(props: DialogTriggerProps) {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error("DialogTrigger must be used within a Dialog component.");
  }

  return (
    <div onClick={context.openDialog} className="cursor-pointer">
      {props.children}
    </div>
  );
}

interface DialogContentProps {
  children: React.ReactNode;
}

export function DialogContent(props: DialogContentProps) {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error("DialogTrigger must be used within a Dialog component.");
  }

  return (
    <div onClick={context.openDialog} className="cursor-pointer">
      {props.children}
    </div>
  );
}
