import { useState } from "react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import uploadImage from "@/features/systems/actions/uploadImage";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploaderProps {
  fileName?: string;
  onUpload?: (fileName: string) => void;
}

export default function ImageUploader(props: ImageUploaderProps) {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ file, fileName }: { file: File; fileName: string }) =>
      uploadImage(file, fileName),
    onSuccess: (data) => {
      toast.success("Image uploaded successfully!", { id: "upload-image" });
      setImage(data);
      props.onUpload?.(props.fileName || "");
    },
    onError: () => {
      toast.error("Failed to upload image", { id: "upload-image" });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    mutate({ file: file, fileName: props.fileName || "" });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {image && (
        <Image
          src={image}
          alt="Preview"
          width={160}
          height={160}
          className="w-auto h-24 object-fill rounded-lg shadow-md"
        />
      )}
      <div className="flex flex-col gap-2">
        {image && (
          <button
            className="cursor-pointer px-4 py-2 rounded-lg bg-C1 text-white"
            onClick={handleUpload}
            disabled={isPending}
          >
            <span className="text-sm font-medium">
              {isPending ? "Uploading..." : "Upload Image"}
            </span>
          </button>
        )}
        <label
          className={cn(
            "",
            image
              ? " text-gray-600 cursor-pointer hover:underline !hover:font-bold"
              : "cursor-pointer px-4 py-2 rounded-lg bg-C1 text-white"
          )}
        >
          <span className="text-sm font-medium">
            {image ? "Select New Image?" : "Select Image"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
}
