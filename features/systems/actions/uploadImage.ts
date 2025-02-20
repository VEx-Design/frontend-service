import { client } from "@/lib/service";

export default async function uploadImage(
  file: File,
  fileName: string
): Promise<string | null> {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);
  if (fileName != "") formData.append("fileName", fileName);

  try {
    const { data } = await client.post(
      "file-management-service/upload",
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return data.filePath;
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
}
