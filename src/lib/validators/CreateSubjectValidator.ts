import { z } from "zod";

export const CreateSubjectValidator = z.object({
  classroomId: z.string(),
  subjectName: z.string()
});

export type CreateSubjectRequest = z.infer<typeof CreateSubjectValidator>;

