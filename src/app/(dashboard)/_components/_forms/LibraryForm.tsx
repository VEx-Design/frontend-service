import { z } from "zod";
import React, { useState } from "react";
import Input from "@/src/components/_Input/Input";
import AddInput from "@/src/components/_Input/AddInput";

interface LibraryFormProp {
  onSubmit: () => void;
}

interface FormData {
  Library_Name: string;
  Library_List: string[];
}

const Library_Name_Schema = z
  .string()
  .regex(/^[A-Za-z\s]+$/, "Library name must be a valid string (no numbers)")
  .min(1, "Library name is required");

const Library_List_Schema = z
  .array(
    z
      .string()
      .regex(
        /^[A-Za-z\s]+$/,
        "Library parameters must be valid strings (no numbers)"
      )
  )
  .min(1, "At least one parameter is required");

const formDataSchema = z.object({
  Library_Name: Library_Name_Schema,
  Library_List: Library_List_Schema,
});

function LibraryForm({ onSubmit }: LibraryFormProp) {
  const [formData, setFormData] = useState<FormData>({
    Library_Name: "",
    Library_List: [],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (field: keyof FormData, value: any) => {
    try {
      if (field === "Library_Name") {
        Library_Name_Schema.parse(value);
      } else if (field === "Library_List") {
        Library_List_Schema.parse(value);
      }

      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "", // ลบ error ถ้าไม่มีปัญหา
      }));
    } catch (err: any) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: err.errors[0]?.message || "Invalid input", // แสดงข้อความ error
      }));
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    validateField(field, value); // Validate the field on change
  };

  const handleListChange = (list: string[]) => {
    setFormData((prevState) => ({
      ...prevState,
      Library_List: list,
    }));
    validateField("Library_List", list); // Validate the field on change
  };

  const handleSubmit = () => {
    const result = formDataSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: { [key: string]: string } = {};
      result.error.errors.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    console.log(formData);
    onSubmit();
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex flex-col gap-5">
        <Input
          title="Library Name"
          placeholder="Fill library name"
          type="text"
          onChange={(input) =>
            handleInputChange("Library_Name", input.target.value)
          }
          errorMessage={errors.Library_Name}
          hasError={!!errors.Library_Name}
        />

        <AddInput
          title="Library parameters"
          placeholder="Insert parameter"
          onListChange={(list) => handleListChange(list)}
          errorMessage={errors.Library_List}
          hasError={!!errors.Library_List}
        />
      </div>
      <div className="flex justify-end mt-4">
        <button
          className="bg-C1 hover:bg-blue-500 py-2 px-4 rounded-lg text-white w-fit "
          onClick={handleSubmit}
        >
          Create
        </button>
      </div>
    </div>
  );
}

export default LibraryForm;
