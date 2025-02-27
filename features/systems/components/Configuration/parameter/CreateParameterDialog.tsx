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

interface CreateProjectDialogProps {
  onCreated?: () => void;
}

export default function CreateParameterDialog({}: CreateProjectDialogProps) {
  const [isOpen, setOpen] = useState(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => {
    setOpen(false);
  };

  const form = useForm<createParameterData>({
    resolver: zodResolver(createParameterSchema),
    defaultValues: {},
  });

  const { configAction } = useProject();

  const onSubmit = useCallback(
    (values: createParameterData) => {
      toast.loading("Creating Parameter...", { id: "create-parameter" });
      createParameter(values)
        .then((result) => {
          configAction.addParameter(result);
          toast.success("Parameter Created!", { id: "create-parameter" });
          form.reset();
          closeDialog();
        })
        .catch((error: Error) => {
          toast.error(error.message, { id: "create-parameter" });
        });
    },
    [configAction, form]
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
            name="symbol"
            register={form.register}
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
      </DialogContent>
    </Dialog>
  );
}
