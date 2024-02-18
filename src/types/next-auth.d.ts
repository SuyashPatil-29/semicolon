import NextAuth from "next-auth";
import { access } from "@prisma/client";

declare module "next-auth" {
  interface User {
    name: string;
    usn: string;
    access: "STUDENT" | "HOD" | "TEACHER" | "CR";
  }
  interface Session {
    user: {
      name: string;
      usn: string;
      access: "STUDENT" | "HOD" | "TEACHER" | "CR";
      id: string;
    };
  }
}
