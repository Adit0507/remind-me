"use client";

import { Collection, Task } from "@prisma/client";
import React, { useState, useTransition } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import PlusIcon from "./icons/PlusIcon";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogDescription,
} from "./ui/alert-dialog";
import { toast } from "./ui/use-toast";

import CreateTaskDialog from "./CreateTaskDialog";

import { cn } from "@/lib/utils";
import { CollectionColor, CollectionColors } from "@/lib/constants";
import { CaretDownIcon, CaretUpIcon, TrashIcon } from "@radix-ui/react-icons";
import { deleteCollection } from "@/actions/collection";
import { useRouter } from "next/navigation";

interface Props {
  collection: Collection & {
    tasks: Task[];
  };
}

const CollectionCard = ({ collection }: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, startTranstion] = useTransition();

  const router = useRouter();

  const tasks = collection.tasks;

  const [showCreateModal, setShowCreateModal] = useState(false);

  const removeCollection = async () => {
    try {
      await deleteCollection(collection.id);
      toast({
        title: "Success",
        description: "Collection deleted successfully",
      });

      router.refresh();
    } catch (e) {
      toast({
        title: "Error",
        description: "Cannot delete collection",
        variant: "destructive",
      });
    }

    await deleteCollection(collection.id);
  };

  return (
    <>
      <CreateTaskDialog
        open={showCreateModal}
        setOpen={setShowCreateModal}
        collection={collection}
      />
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant={"ghost"}
            className={cn(
              "flex w-full justify-between p-6",
              isOpen && "rounded-b-none",
              CollectionColors[collection.color as CollectionColor]
            )}
          >
            <span className="text-white font-bold">{collection.name}</span>
            {!isOpen && <CaretDownIcon className="h-6 w-6" />}
            {isOpen && <CaretUpIcon className="h-6 w-6" />}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          {tasks.length === 0 && <div>No tasks</div>}

          {tasks.length > 0 && (
            <>
              <Progress className="rounded-none" value={45} />
              <div className="p-4 gap-3 flex flex-col">
                {collection.tasks.map((task) => (
                  <div key={task.id}>{task.content}</div>
                ))}
              </div>
            </>
          )}

          <Separator />
          <footer className="h-[40px] px-4 p-[2px] text-xs text-neutral-500 flex justify-between items-center">
            <p>Created at {collection.createdAt.toLocaleDateString("en-US")}</p>
            {isLoading && <div>Deleting....</div>}
            {!isLoading && (
              <div>
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  onClick={() => setShowCreateModal(true)}
                >
                  <PlusIcon />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size={"icon"} variant={"ghost"}>
                      <TrashIcon />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogTitle>Are u absolutely sure ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      The action cant be undone. This will permanently delete
                      your tasks and collections
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                    <AlertDialogAction
                      onClick={() => {
                        startTranstion(removeCollection);
                      }}
                    >
                      Proceed
                    </AlertDialogAction>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </footer>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};

export default CollectionCard;
