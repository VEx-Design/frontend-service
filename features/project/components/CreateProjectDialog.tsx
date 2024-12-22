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
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectData, createProjectSchema } from "../schema/project";
import { useMutation } from "@tanstack/react-query";
import createProject from "../actions/createProject";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function CreateProjectDialog() {
  const form = useForm<createProjectData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {},
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast.success("Workflow created", { id: "create-workflow" });
    },
    onError: () => {
      toast.error("Failed to create workflow", { id: "create-workflow" });
    },
  });

  const onSubmit = (data: createProjectData) => {
    mutate(data);
  };

  return (
    <Dialog title="New Project">
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input field={field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="description"
            register={form.register}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input field={field} />
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
