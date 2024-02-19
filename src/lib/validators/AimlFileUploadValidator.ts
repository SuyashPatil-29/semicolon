import { z } from "zod";

export const AimlFileUploadValidator = z.object({
  fileUrl: z.string(),
  fileSize: z.number(),
  userId: z.string(),
  userName: z.string(),
  uploadedAt : z.string(),
  name : z.string()
})

export type AimlFileUploadRequest = z.infer<typeof AimlFileUploadValidator>;

