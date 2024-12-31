"use client";

import React, { useMemo } from "react";
import {
  FieldValues,
  Path,
  SubmitHandler,
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormReturn,
} from "react-hook-form";
import { getChild, getChildren } from "./getChildren";

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

  return (
    <form onSubmit={props.form.handleSubmit(props.onSubmit)}>
      {fields}
      <div>{button}</div>
    </form>
  );
}

interface FormSubmitProps {
  children: React.ReactNode;
}

export function FormSubmit(props: FormSubmitProps) {
  return <div className="flex justify-end">{props.children}</div>;
}

interface FormFieldProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  register: UseFormRegister<TFormValues>;
  render: (field: { field: UseFormRegisterReturn }) => React.ReactNode;
}

export function FormField<TFormValues extends FieldValues>(
  props: FormFieldProps<TFormValues>
) {
  const register = props.register;
  return (
    <div className="pb-3">{props.render({ field: register(props.name) })}</div>
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
  return <div>{props.children}</div>;
}
