import { UseFormRegisterReturn } from "react-hook-form";

export default interface InputProps {
  field?: UseFormRegisterReturn;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  type?: string;
}
