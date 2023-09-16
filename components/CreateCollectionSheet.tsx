import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormLabel,
  FormItem,
  FormDescription,
  FormMessage,
  FormField,
} from "./ui/form";

import { toast } from "./ui/use-toast";
import { Input } from "./ui/input";

import { CollectionColors, CollectionColor } from "@/lib/constants";

import {
  createCollectionSchema,
  createCollectionSchemaType,
} from "@/schema/createCollection";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { createCollection } from "@/actions/collection";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateCollectionSheet = ({ open, onOpenChange }: Props) => {
  const form = useForm<createCollectionSchemaType>({
    defaultValues: {},
    resolver: zodResolver(createCollectionSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: createCollectionSchemaType) => {
    try {
      await createCollection(data);
      // close sheet
      openChangeWrapper(false);
      router.refresh();

      toast({
        title: "SUCCESS",
        description: "collection created successfully",
      });
    } catch (error: any) {
      toast({
        title: "ERROR",
        description: "Something went wrong. Plz try again",
        variant: "destructive",
      });

      console.log("Error while creating collection", error);
    }
  };

  const openChangeWrapper = (open: boolean) => {
    form.reset();
    onOpenChange(open);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Collection</SheetTitle>
          <SheetDescription>
            Collections are a way to group your tasks
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Personal" {...field} />
                  </FormControl>
                  <FormDescription>Collection Name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            

          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateCollectionSheet;
