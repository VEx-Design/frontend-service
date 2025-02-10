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

import { toast } from "sonner";
import {
  createPropertyData,
  createPropertySchema,
} from "@/features/systems/schema/property";
import createProperty from "@/features/systems/libs/ClassType/createProperty";
import { useConfig } from "@/features/systems/contexts/ConfigContext";

interface CreatePropertyDialogProps {
  onCreated?: () => void;
}

export default function CreatePropertyDialog({}: CreatePropertyDialogProps) {
  const [isOpen, setOpen] = useState(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => {
    setOpen(false);
  };

  const form = useForm<createPropertyData>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: {},
  });

  const { typeAction } = useConfig();

  const onSubmit = useCallback(
    (values: createPropertyData) => {
      toast.loading("Creating Property...", { id: "create-property" });
      createProperty(values)
        .then((result) => {
          typeAction.addProperty(result);
          toast.success("Type Property!", { id: "create-property" });
          form.reset();
          closeDialog();
        })
        .catch((error: Error) => {
          toast.error(error.message, { id: "create-property" });
        });
    },
    [form, typeAction]
  );

  return (
    <Dialog
      title="New Property"
      isOpen={isOpen}
      openDialog={openDialog}
      closeDialog={closeDialog}
    >
      <DialogTrigger>
        <button className="w-full flex flex-1 bg-white border-2 border-gray-300 border-dashed rounded-xl justify-center items-center py-3">
          <Plus size={16} color="gray" />
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
