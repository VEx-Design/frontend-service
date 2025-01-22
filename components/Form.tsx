"use client";

import React, { createContext, useContext, useMemo } from "react";
import {
  FieldErrors,
  FieldValues,
  Path,
  SubmitHandler,
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormReturn,
} from "react-hook-form";
import { getChild, getChildren } from "./libs/getChildren";

interface FormContextType<TFieldValues extends FieldValues> {
  errors: FieldErrors<TFieldValues>;
}

export const FormContext = createContext<
  FormContextType<FieldValues> | undefined
>(undefined);

interface FormProps<TFormValues extends FieldValues> {
  form: UseFormReturn<TFormValues>;
  onSubmit: SubmitHandler<TFormValues>;
  children: React.ReactNode;
}

export function Form<TFormValues extends FieldValues>(
  props: FormProps<TFormValues>
) {
  const fields = useMemo(
    () => getChildren(props.children, FormField),
    [props.children]
  );

  const button = useMemo(
    () => getChild(props.children, FormSubmit),
    [props.children]
  );

  const {
    formState: { errors },
  } = props.form;

  return (
    <FormContext.Provider value={{ errors: errors }}>
      <form onSubmit={props.form.handleSubmit(props.onSubmit)}>
        {fields}
        <div>{button}</div>
      </form>
    </FormContext.Provider>
  );
}

interface FormSubmitProps {
  children: React.ReactNode;
}

export function FormSubmit(props: FormSubmitProps) {
  return <div className="flex justify-end">{props.children}</div>;
}

export const FormFieldContext = createContext<{ name: string } | undefined>(
  undefined
);

interface FormFieldProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  register: UseFormRegister<TFormValues>;
  render: (field: {
    field: UseFormRegisterReturn;
    isError: boolean;
  }) => React.ReactNode;
  required?: boolean;
}

export function FormField<TFormValues extends FieldValues>(
  props: FormFieldProps<TFormValues>
) {
  const register = props.register;
  const formContext = useContext(FormContext);

  if (!formContext) {
    throw new Error("FormControl must be used within a FormProvider");
  }

  const error = formContext.errors[props.name];
  const isError = !(error === undefined);
  console.log(isError);

  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <div className="pb-3">
        {props.render({
          field: register(props.name),
          isError,
        })}
      </div>
    </FormFieldContext.Provider>
  );
}

interface FormItemProps {
  children: React.ReactNode;
}

export function FormItem(props: FormItemProps) {
  const label = useMemo(
    () => getChild(props.children, FormLabel),
    [props.children]
  );

  const control = useMemo(
    () => getChild(props.children, FormControl),
    [props.children]
  );

  return (
    <div className="flex flex-col gap-1">
      <div>{label}</div>
      <div>{control}</div>
    </div>
  );
}

interface FormLabelProps {
  children: React.ReactNode;
}

export function FormLabel(props: FormLabelProps) {
  return <div>{props.children}</div>;
}

interface FormControlProps {
  children: React.ReactNode;
}

export function FormControl(props: FormControlProps) {
  const formContext = useContext(FormContext);

  if (!formContext) {
    throw new Error("FormControl must be used within a FormProvider");
  }

  const fieldContext = useContext(FormFieldContext);

  if (!fieldContext) {
    throw new Error("FormControl must be used within a FormFieldProvider");
  }

  const errorMessage = formContext.errors[fieldContext.name]?.message as
    | string
    | undefined;

  return (
    <div>
      {props.children}
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
    </div>
  );
}
