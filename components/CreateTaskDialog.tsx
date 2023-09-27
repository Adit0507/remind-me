"use client";

import React from "react";
import { Collection } from "@prisma/client";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { CollectionColor, CollectionColors } from "@/lib/constants";
import { useForm } from "react-hook-form";
import { createTaskSchema, createTaskSchemaType } from "@/schema/createTask";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { CalendarIcon, ReloadIcon } from "@radix-ui/react-icons";
import format from "date-fns/format";
import { createTask } from "@/actions/tasks";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  collection: Collection;
  setOpen: (open: boolean) => void;
}

const CreateTaskDialog = ({ open, collection, setOpen }: Props) => {
  const form = useForm<createTaskSchemaType>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      collectionId: collection.id,
    },
  });

  const router = useRouter();

  const openChangeWrapper = (value: boolean) => {
    setOpen(value);
    form.reset();
  };

  const onSubmit = async (data: createTaskSchemaType) => {
    try {
      await createTask(data);

      toast({
        title: "Success",
        description: "Task created successfully",
      });

      openChangeWrapper(false);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Cannot create Task :(",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={openChangeWrapper}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add task to collection:{" "}
            <span
              className={cn(
                "p-[1px] bg-clip-text text-transparent",
                CollectionColors[collection.color as CollectionColor]
              )}
            >
              {collection.name}
            </span>
          </DialogTitle>

          <DialogDescription>
            Add a task to your collection. Add as many tasks u want 😊
          </DialogDescription>
        </DialogHeader>

        <div className="gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="content"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Task content here"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
                <FormItem></FormItem>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
