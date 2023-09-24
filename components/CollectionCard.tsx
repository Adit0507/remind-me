"use client";

import { Collection } from "@prisma/client";
import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CollectionColor, CollectionColors } from "@/lib/constants";
import { CaretDownIcon, CaretUpIcon } from "@radix-ui/react-icons";

interface Props {
  collection: Collection;
}

const CollectionCard = ({ collection }: Props) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn(
            "flex w-full justify-between p-6",
            CollectionColors[collection.color as CollectionColor]
          )}
        >
          <span className="text-white font-bold">{collection.name}</span>
            {!isOpen && <CaretDownIcon className="h-6 w-6" />}
            {isOpen && <CaretUpIcon className="h-6 w-6" />}
        </Button>
      </CollapsibleTrigger>
    </Collapsible>
  );
};

export default CollectionCard;
