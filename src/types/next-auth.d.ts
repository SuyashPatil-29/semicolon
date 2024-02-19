import NextAuth from "next-auth";
import { access } from "@prisma/client";

declare module "next-auth" {
  interface User {
    name: string;
    usn: string;
    access: access;
  }
  interface Session {
    user: {
      name: string;
      usn: string;
      access: access
      id: string;
    };
  }
}
