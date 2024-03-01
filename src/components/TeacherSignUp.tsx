"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "./ui/card";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { toast } from "./ui/use-toast";
import { redirect } from "next/navigation";
import {
  SignUpRequest,
  SignUpValidator,
} from "@/lib/validators/SignUpValidator";
import VerifyTeacherEmail from "./VerifyTeacherEmail";
import { access } from "@prisma/client";

const TeacherSignUp = () => {
  const form = useForm<SignUpRequest>({
    resolver: zodResolver(SignUpValidator),
    defaultValues: {
      username: "",
      usn: "",
      password: "",
      email: "",
    },
  });

  type ModifiedUser = {
    code: string;
    confirmPassword: string;
    email: string;
    password: string;
    username: string;
    usn: string;
    access: access;
  };

  const [user, setUser] = React.useState<
    ModifiedUser | undefined
  >(undefined);

  const onSubmit = async (values: z.infer<typeof SignUpValidator>) => {
    try {
      const payload = {
        email: values.email.trim(),
        username: values.username.trim(),
        usn: values.usn.trim(),
        password: values.password.trim(),
        confirmPassword: values.confirmPassword.trim(),
        access: "TEACHER",
      };

      const { data } = await axios.post("/api/send-email", payload);
      console.log("data", data);
if (data) {
        setUser(data);
        return toast({
          title: "Verification email sent.",
          description: `Check ${payload.email} for the verification link.`,
          variant: "default",
        });
      }
    } catch (error: AxiosError | any | undefined) {
      console.log("error", error);
        return toast({
          title: "Something went wrong",
          description: "Please try again later.",
          variant: "destructive",
        });
    }
  };

  if (user) {
    console.log("user", user);
    return <VerifyTeacherEmail user={user}/>;
  }

  return (
    <Card className="rounded-xl py-8 px-44 dark:bg-[rgb(35,35,35)] bg-neutral-200 border dark:border-[rgb(255,215,0)]/20 border-black">
      <div className="space-y-2 text-center pb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Sign Up
        </h1>
        <p className="text-gray-500 dark:text-muted-foreground">
          Enter your information to create an account
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="w-[500px]"
                    placeholder="Suyash Patil"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="patilsuyash892@gmail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="usn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>USN</FormLabel>
                <FormControl>
                  <Input placeholder="1NH22AI170" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="********" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="********" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              isLoading={form.formState.isSubmitting}
              className="w-full"
            >
              {" "}
              Submit
            </Button>
            <Link
              href="/sign-in"
              className="text-center text-muted-foreground font-semibold"
            >
              Already have an account? Login
            </Link>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default TeacherSignUp;
