"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/Dialog";
import React from "react";

export default function CreateProjectDialog() {
  return (
    <Dialog title="New Project">
      <DialogTrigger>
        <button className="bg-C1 text-white p-2 rounded-lg hover:bg-blue-500">
          + Project
        </button>
      </DialogTrigger>
      <DialogContent>
        <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Close
        </button>
      </DialogContent>
    </Dialog>
  );
}
