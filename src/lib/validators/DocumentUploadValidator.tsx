import { z } from "zod";

export const DocumentUploadValidator = z.object({
  fileUrl: z.string(),
  fileSize: z.number(),
  subjectId: z.string(),
  classroomId: z.string(),
  uploadedBy: z.string(),
  uploadedAt : z.string(),
  name : z.string(),
  id : z.string()
})

export type DocumentUploadRequest = z.infer<typeof DocumentUploadValidator>;


