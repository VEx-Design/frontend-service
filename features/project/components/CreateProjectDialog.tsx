"use client";

import Button from "@/components/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/Dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormSubmit,
} from "@/components/Form";
import Input from "@/components/inputs/Input";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectData, createProjectSchema } from "../schema/project";
import { useMutation } from "@tanstack/react-query";
import createProject from "../actions/createProject";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateProjectDialogProps {
  onCreated?: () => void;
}

export default function CreateProjectDialog(props: CreateProjectDialogProps) {
  const [isOpen, setOpen] = useState(false);
  const { onCreated } = props;

  const openDialog = () => setOpen(true);
  const closeDialog = () => {
    setOpen(false);
  };

  const form = useForm<createProjectData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {},
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast.success("Project created", { id: "create-project" });
      if (onCreated) {
        onCreated();
      }
    },
    onError: () => {
      toast.error("Failed to create project", { id: "create-project" });
    },
  });

  const onSubmit = useCallback(
    (values: createProjectData) => {
      toast.loading("Creating project...", { id: "create-project" });
      mutate(values);
      form.reset();
      closeDialog();
    },
    [mutate, form]
  );

  return (
    <Dialog
      title="New Project"
      isOpen={isOpen}
      openDialog={openDialog}
      closeDialog={closeDialog}
    >
      <DialogTrigger>
        <button className="bg-C1 text-white p-2 rounded-lg hover:bg-blue-500">
          + Project
        </button>
      </DialogTrigger>
      <DialogContent>
        <Form form={form} onSubmit={onSubmit}>
          <FormField
            name="name"
            register={form.register}
            render={({ field, isError }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    field={field}
                    className={
                      isError
                        ? "border-red-500 focus:border-red-500 focus:outline-none"
                        : ""
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="description"
            register={form.register}
            render={({ field, isError }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    field={field}
                    className={
                      isError
                        ? "border-red-500 focus:border-red-500 focus:outline-none"
                        : ""
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormSubmit>
            <Button type="submit">
              {!isPending && "Create"}
              {isPending && <Loader2 className="animate-spin" />}
            </Button>
          </FormSubmit>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
