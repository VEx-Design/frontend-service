import { z } from "zod";
import React, { useState } from "react";
import Input from "@/src/components/_Input/Input";
import AddInput from "@/src/components/_Input/AddInput";

interface TypeFormProp {
  onSubmit: () => void;
}

interface FormData {
  Type_Name: string;
  Type_List: string[];
}

const Type_Name_Schema = z
  .string()
  .regex(/^[A-Za-z\s]+$/, "Type name must be a valid string (no numbers)")
  .min(1, "Type name is required");

const Type_List_Schema = z
  .array(
    z
      .string()
      .regex(
        /^[A-Za-z\s]+$/,
        "Type parameters must be valid strings (no numbers)"
      )
  )
  .min(1, "At least one parameter is required");

const formDataSchema = z.object({
  Type_Name: Type_Name_Schema,
  Type_List: Type_List_Schema,
});

function TypeForm({ onSubmit }: TypeFormProp) {
  const [formData, setFormData] = useState<FormData>({
    Type_Name: "",
    Type_List: [],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (field: keyof FormData, value: any) => {
    try {
      if (field === "Type_Name") {
        Type_Name_Schema.parse(value);
      } else if (field === "Type_List") {
        Type_List_Schema.parse(value);
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
    validateField(field, value);
  };

  const handleListChange = (list: string[]) => {
    setFormData((prevState) => ({
      ...prevState,
      Type_List: list,
    }));
    validateField("Type_List", list);
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
          title="Type Name"
          placeholder="Fill Type name"
          type="text"
          onChange={(input) =>
            handleInputChange("Type_Name", input.target.value)
          }
          errorMessage={errors.Type_Name}
          hasError={!!errors.Type_Name}
        />

        <AddInput
          title="Type parameters"
          placeholder="Insert parameter"
          onListChange={(list) => handleListChange(list)}
          errorMessage={errors.Type_List}
          hasError={!!errors.Type_List}
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

export default TypeForm;
