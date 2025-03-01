import React, { useCallback, useState } from "react";
import Button from "@/components/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/Dialog";
import Input from "@/components/inputs/Input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormSubmit,
} from "@/components/Form";
import { Plus } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createParameterData,
  createParameterSchema,
} from "@/features/systems/schema/parameter";
import { toast } from "sonner";

import createParameter from "@/features/systems/libs/ClassParameter/createParameter";
import { useProject } from "@/features/systems/contexts/ProjectContext";
import { cn } from "@/lib/utils";
import {
  createParameterGroupData,
  createParameterGroupSchema,
} from "@/features/systems/schema/parameterGroup";
import createParameterGroup from "@/features/systems/libs/ClassParameter/createParameterGroup";

interface CreateProjectDialogProps {
  onCreated?: () => void;
}

export default function CreateParameterDialog({}: CreateProjectDialogProps) {
  const [isOpen, setOpen] = useState(false);
  const [isCreateGroup, setIsCreateGroup] = useState(false);

  const openDialog = () => setOpen(true);

  const createParameterForm = useForm<createParameterData>({
    resolver: zodResolver(createParameterSchema),
    defaultValues: {},
  });

  const createParameterGroupForm = useForm<createParameterGroupData>({
    resolver: zodResolver(createParameterGroupSchema),
    defaultValues: {},
  });

  const closeDialog = useCallback(() => {
    setOpen(false);
    createParameterForm.reset();
  }, [createParameterForm]);

  const { configAction } = useProject();

  const onSubmit = useCallback(
    (values: createParameterData) => {
      toast.loading("Creating Parameter...", { id: "create-parameter" });
      createParameter(values)
        .then((result) => {
          configAction.addParameter(result);
          toast.success("Parameter Created!", { id: "create-parameter" });
          createParameterForm.reset();
          createParameterGroupForm.reset();
          closeDialog();
        })
        .catch((error: Error) => {
          toast.error(error.message, { id: "create-parameter" });
        });
    },
    [configAction, createParameterForm, createParameterGroupForm, closeDialog]
  );

  const onSubmitGroup = useCallback(
    (values: createParameterGroupData) => {
      toast.loading("Creating Parameter Group...", {
        id: "create-parameter-group",
      });
      createParameterGroup(values)
        .then((result) => {
          configAction.addParameterGroup(result);
          toast.success("Parameter Group Created!", {
            id: "create-parameter-group",
          });
          createParameterForm.reset();
          createParameterGroupForm.reset();
          closeDialog();
        })
        .catch((error: Error) => {
          toast.error(error.message, { id: "create-parameter-group" });
        });
    },
    [configAction, createParameterForm, createParameterGroupForm, closeDialog]
  );

  return (
    <Dialog
      title="New Parameter"
      isOpen={isOpen}
      openDialog={openDialog}
      closeDialog={closeDialog}
    >
      <DialogTrigger>
        <button
          className="rounded-full bg-gray-300 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-lg focus:bg-C1 focus:shadow-none active:bg-C1 hover:bg-C1 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          <Plus size={16} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant={isCreateGroup ? "transparent" : "primary"}
            className={cn("flex-1", {
              "!cursor-default hover:!bg-C1": !isCreateGroup,
            })}
            handleButtonClick={() => setIsCreateGroup(false)}
          >
            New Parameter
          </Button>
          <Button
            variant={isCreateGroup ? "primary" : "transparent"}
            className={cn("flex-1", {
              "!cursor-default hover:!bg-C1": isCreateGroup,
            })}
            handleButtonClick={() => setIsCreateGroup(true)}
          >
            New Group
          </Button>
        </div>
        {!isCreateGroup ? (
          <Form form={createParameterForm} onSubmit={onSubmit}>
            <FormField
              name="name"
              register={createParameterForm.register}
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
              name="symbol"
              register={createParameterForm.register}
              render={({ field, isError }) => (
                <FormItem>
                  <FormLabel>Symbol</FormLabel>
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
              <Button type="submit">Create</Button>
            </FormSubmit>
          </Form>
        ) : (
          <Form form={createParameterGroupForm} onSubmit={onSubmitGroup}>
            <FormField
              key="group-name"
              name="name"
              register={createParameterGroupForm.register}
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
            <FormSubmit>
              <Button type="submit">Create</Button>
            </FormSubmit>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
