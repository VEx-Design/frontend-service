import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/Dialog";
import { Upload } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import { useConfigType } from "@/features/systems/contexts/Configuration/ConfigTypeContext";

interface CreatePropertyDialogProps {
  onCreated?: () => void;
}

export default function CreatePropertyDialog({}: CreatePropertyDialogProps) {
  const { currentType, typeAction } = useConfigType();

  const [isOpen, setOpen] = useState(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => {
    setOpen(false);
  };

  const onUpload = (fileName: string) => {
    typeAction.editImage(`http://localhost:9000/default-bucket/${fileName}`);
    closeDialog();
  };

  return (
    <Dialog
      title="Upload Image"
      isOpen={isOpen}
      openDialog={openDialog}
      closeDialog={closeDialog}
    >
      <DialogTrigger>
        <button className="flex flex-1 w-full justify-center items-center bg-C1 text-white py-2 text-sm rounded-lg">
          <Upload size={18} />
          <p className="ms-1">Upload Image</p>
        </button>
      </DialogTrigger>
      <DialogContent>
        <ImageUploader
          fileName={`${currentType?.id}-${Date.now()}.png`}
          onUpload={onUpload}
        />
      </DialogContent>
    </Dialog>
  );
}
