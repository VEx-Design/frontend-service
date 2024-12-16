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
import { z } from "zod";

export default function CreateProjectDialog() {
  const createProjectSchema = z.object({
    name: z.string().max(50),
    description: z.string().max(80).optional(),
  });

  type createProjectData = z.infer<typeof createProjectSchema>;
  const form = useForm<createProjectData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {},
  });

  const onSubmit = (data: createProjectData) => {
    console.log("Form data submitted: ", data);
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
            <Button type="submit">Create</Button>
          </FormSubmit>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
