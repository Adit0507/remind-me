import { z } from "zod";
import { CollectionColors } from "@/lib/constants";

export const createCollectionSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Collection name must be 5 characters long" }),
  color: z
    .string()
    .refine((color) => Object.keys(CollectionColors).includes(color)),
});

export type createCollectionSchemaType = z.infer<typeof createCollectionSchema>;
