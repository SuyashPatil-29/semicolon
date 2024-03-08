"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  SignUpRequest,
  SignUpValidator,
} from "@/lib/validators/SignUpValidator";
import VerifyEmail from "./VerifyEmail";

const SignUp = () => {
  const form = useForm<SignUpRequest>({
    resolver: zodResolver(SignUpValidator),
    defaultValues: {
      username: "",
      usn: "",
      password: "",
      confirmPassword: "",
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
    access: string;
  };

  const [user, setUser] = React.useState<ModifiedUser | undefined>(undefined);

  const onSubmit = async (values: z.infer<typeof SignUpValidator>) => {
    try {
      const payload = {
        username: values.username.trim(),
        usn: values.usn.trim(),
        password: values.password.trim(),
        confirmPassword: values.confirmPassword.trim(),
        email: values.email.trim(),
      };

      const { data } = await axios.post("/api/send-email", payload);
      if (data) {
        setUser(data);
        return toast({
          title: "Verification email sent.",
          description: `Check ${payload.email} for the verification link.`,
          variant: "default",
        });
      }
    } catch (error: AxiosError | any | undefined) {
      return toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (user) {
    return <VerifyEmail user={user} />;
  }

  return (
    <Card className="rounded-xl md:px-44 md:-mt-0 -mt-24 px-2 py-8 md:py-6 dark:bg-[rgb(15,15,15)] bg-neutral-200 border dark:border-[rgb(162,162,162)]/20 border-black">
      <div className="space-y-2 text-center pb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Sign Up
        </h1>
        <p className="text-gray-500 dark:text-muted-foreground">
          Enter your information to create an account
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="md:space-y-2 space-y-4 md:max-w-[80vw] max-w-[300px] mx-auto"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Ex: Suyash Patil"
                    className="md:w-[500px] w-full mx-auto"
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
                    placeholder="Ex: patilsuyash892@gmail.com"
                    className="md:w-[500px] w-full mx-auto"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  You will recieve a verification OTP and all other updates on
                  this email.
                </FormDescription>
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
                  <Input
                    placeholder="Ex: 1NH22AI170"
                    {...field}
                    className="md:w-[500px] w-full mx-auto"
                  />
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
                  <Input
                    placeholder="********"
                    type="password"
                    {...field}
                    className="md:w-[500px] w-full mx-auto"
                  />
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
                  <Input
                    placeholder="********"
                    type="password"
                    {...field}
                    className="md:w-[500px] w-full mx-auto"
                  />
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

export default SignUp;
