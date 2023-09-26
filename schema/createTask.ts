import z from "zod";

export const createTaskSchema = z.object({
  collectionId: z.number().nonnegative(),
  content: z
    .string()
    .min(10, { message: "Task content must be atleast 10 characters long" }),
    expiresAt: z.date().optional()
});

export type createTaskSchemaType = z.infer<typeof createTaskSchema>