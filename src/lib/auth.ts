import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import { access } from "@prisma/client";

export const authOptions : NextAuthOptions = {
  adapter : PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages:{
  signIn : '/sign-in',
  },
  providers: [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      usn : {label: "USN", type: "text", placeholder: "1NH22AI170"},  
      name: { label: "Username", type: "text", placeholder: "Suyash Patil" },
      password: { label: "Password", type: "password", placeholder: "********" },
    },
    // @ts-ignore
    async authorize(credentials) {
      if (!credentials?.usn || !credentials?.password || !credentials?.name) {
        return null;
      }
      const existingUser = await db.user.findFirst({
          where: {
            usn: credentials?.usn,
            name: credentials?.name
          }
        })
        if(!existingUser) return null
        
        const passwordMatch = await compare(credentials?.password, existingUser.password)
        if(!passwordMatch) return null

        return {
          id: existingUser.id,
          usn: existingUser.usn,
          name: existingUser.name,
          access: existingUser.access,
          email: existingUser.email
        }
    }
  })
],
callbacks: {
  async session({ session, token }) {
    session.user = {
      ...session.user,
      id: token.id as string,
      usn: token.usn as string,
      name: token.name as string,
      access: token.access as access,
      email: token.email as string
    };
    return session;
  },
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.usn = user.usn;
      token.name = user.name;
      token.access = user.access;
      token.email = user.email
    }
    return token;
  }
}
}
