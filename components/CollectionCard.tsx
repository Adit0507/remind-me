"use client";

import { Collection, Task } from "@prisma/client";
import React, { useMemo, useState, useTransition } from "react";
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
import TaskCard from "./TaskCard";

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
  };

  const tasksDone = useMemo(() => {
    return collection.tasks.filter((task) => task.done).length;
  }, [collection.tasks]);

  const progress =
    collection.tasks.length === 0
      ? 0
      : (tasksDone / collection.tasks.length) * 100;

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

        <CollapsibleContent className="flex rounded-b-md flex-col dark:bg-neutral-900 shadow-lg">
          {tasks.length === 0 && (
            <Button
              variant={"ghost"}
              className="flex items-center justify-center gap-1 p-8 py-12 rounded-none"
              onClick={() => setShowCreateModal(true)}
            >
              <p>There are no tasks yet :</p>
              <span
                className={cn(
                  "text-sm bg-clip-text text-transparent",
                  CollectionColors[collection.color as CollectionColor]
                )}
              >
                Create one
              </span>
            </Button>
          )}

          {tasks.length > 0 && (
            <>
              <Progress value={progress} className="rounded-none" />
              <div className="p-4 gap-3 flex flex-col">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </>
          )}

          <Separator />
          <footer className="h-[40px] px-4 p-[2px] text-xs text-neutral-500 flex justify-between items-center">
            <p>Created at {collection.createdAt.toLocaleDateString("en-US")}</p>
            {isLoading && <div className="font-bold">Deleting....</div>}
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
