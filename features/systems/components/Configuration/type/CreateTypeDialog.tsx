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
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { ProjectContext } from "../../Project";
import {
  createTypeData,
  createTypeSchema,
} from "@/features/systems/schema/type";
import createType from "@/features/systems/libs/createType";

interface CreateProjectDialogProps {
  onCreated?: () => void;
}

export default function CreateTypeDialog(props: CreateProjectDialogProps) {
  const context = React.useContext(ProjectContext);
  if (!context) {
    throw new Error("CreateTypeDialog must be used within a ProjectContext");
  }

  const [isOpen, setOpen] = useState(false);
  const { onCreated } = props;

  const openDialog = () => setOpen(true);
  const closeDialog = () => {
    setOpen(false);
  };

  const form = useForm<createTypeData>({
    resolver: zodResolver(createTypeSchema),
    defaultValues: {},
  });

  const onSubmit = useCallback(
    (values: createTypeData) => {
      toast.loading("Creating Type...", { id: "create-type" });

      if (!context.config) {
        toast.error("Configuration is missing", { id: "create-type" });
        return;
      }

      createType(values, context.config)
        .then((result) => {
          context.setConfig(result);
          toast.success("Type Created!", { id: "create-type" });
          closeDialog();
          form.reset();
          onCreated?.();
        })
        .catch((error: Error) => {
          toast.error(error.message, { id: "create-type" });
        });
    },
    [context, form, onCreated]
  );

  return (
    <Dialog
      title="New Type"
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
            <Button type="submit">Create</Button>
          </FormSubmit>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
