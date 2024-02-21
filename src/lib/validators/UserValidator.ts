import { Classroom, Document, File, Subject, User, access } from "@prisma/client";

// Define types for the nested structures based on the provided code
export type NewClassroomWithDetails = {
  classroom: ClassroomWithDetails
  classroomId: string,
  user: User
  userId: string
};

type ClassroomWithDetails = {

  admin: User,
  adminId: string,
  created_at: string,
  id: string,
  name: string,
  subjects: Subject[]
  users: User[],
  _count: { users: number }
}

export type UserValidator = {
  classrooms: NewClassroomWithDetails[];
  Documents: Document[];
  Files: File[];
  Subjects: Subject[];
  access: access;
  id: string;
  name: string;
  usn: string;
};;
