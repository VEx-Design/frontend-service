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
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import DropdownForm from "@/components/inputs/DropdownForm";
import {
  createConditionData,
  createConditionSchema,
} from "@/features/systems/schema/condition";
import { useConfigInterface } from "@/features/systems/contexts/ConfigInterfaceContext";
import { useConfig } from "@/features/systems/contexts/ConfigContext";
import createCondition from "@/features/systems/libs/ClassInterface/FeatureFomula/createCondition";

interface AddActionDialogProps {
  onCreated?: () => void;
}

export default function AddActionDialog(props: AddActionDialogProps) {
  const [actionType, setActionType] = useState<string | undefined>(undefined);
  const [isOpen, setOpen] = useState(false);
  const { onCreated } = props;

  const form = useForm<createConditionData>({
    resolver: zodResolver(createConditionSchema),
    defaultValues: {},
  });

  const openDialog = () => setOpen(true);
  const closeDialog = useCallback(() => {
    setActionType(undefined);
    form.reset();
    setOpen(false);
  }, [form]);

  const { currentType } = useConfig();
  const { currentInterface, formulaAction } = useConfigInterface();

  const onSubmit = useCallback(
    (values: createConditionData) => {
      toast.loading("Creating Action...", { id: "add-action" });
      if (currentInterface) {
        createCondition(values)
          .then((condition) => {
            formulaAction.addCondition(condition);
            toast.success("Action added successfully.", {
              id: "add-action",
            });
          })
          .catch((error) => {
            toast.error(error.message, { id: "add-action" });
          });
        closeDialog();
        if (onCreated) {
          onCreated();
        }
      } else {
        toast.error("Current interface is not defined.");
      }
    },
    [closeDialog, currentInterface, formulaAction, onCreated]
  );

  const interfaceCondition =
    currentInterface?.formulaConditions
      .filter((condition) => {
        return condition.type === "TRIGGER AT";
      })
      .map((condition) => {
        return condition.interfaceId;
      }) || [];

  const interfaceOptions =
    currentType?.interfaces
      .filter((item) => {
        return !interfaceCondition.includes(item.id);
      })
      .map((interfaceItem) => ({
        value: interfaceItem.id,
        label: interfaceItem.name,
      })) || [];

  return (
    <Dialog
      title="Add Action"
      isOpen={isOpen}
      openDialog={openDialog}
      closeDialog={closeDialog}
    >
      <DialogTrigger>
        <button className="btn btn-primary text-sm hover:font-semibold">
          + Add Action
        </button>
      </DialogTrigger>
      <DialogContent>
        <Form form={form} onSubmit={onSubmit}>
          <FormField
            name="action"
            control={form.control}
            render={({ control }) => (
              <FormItem>
                <FormLabel>Action</FormLabel>
                <FormControl>
                  <DropdownForm
                    name="action"
                    control={control}
                    options={[{ label: "trigger at", value: "TRIGGER AT" }]}
                    onChange={(value) => setActionType(value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {actionType === "TRIGGER AT" && (
            <FormField
              name="interface"
              control={form.control}
              render={({ control }) => (
                <FormItem>
                  <FormLabel>Interface</FormLabel>
                  <FormControl>
                    <DropdownForm
                      name="interface"
                      control={control}
                      options={interfaceOptions}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          <FormSubmit>
            <Button type="submit">{"Add"}</Button>
          </FormSubmit>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
