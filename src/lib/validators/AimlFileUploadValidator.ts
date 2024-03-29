import { z } from "zod";

export const AimlFileUploadValidator = z.object({
  fileUrl: z.string(),
  fileSize: z.number(),
  userId: z.string(),
  uploadedBy: z.string(),
  uploadedAt : z.string(),
  name : z.string(),
  id : z.string().optional()
})

export type AimlFileUploadRequest = z.infer<typeof AimlFileUploadValidator>;

