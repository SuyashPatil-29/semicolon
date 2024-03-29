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
import { SignInRequest , SignInValidator } from "@/lib/validators/SignInValidator";
import { signIn } from "next-auth/react";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

const SignIn = () => {

  const router = useRouter()

  const form = useForm<SignInRequest>({
    resolver: zodResolver(SignInValidator),
    defaultValues: {
      username: "",
      usn: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignInValidator>) => {
    const signInData = await signIn("credentials", {
      redirect: false,
      name: values.username.trim(),
      usn: values.usn.trim(),
      password: values.password.trim(),
    });

      console.log(signInData ,"signInData.error")
    if(signInData?.error === "CredentialsSignin"){
      return toast({
        title: "Invalid credentials",
        description: "Please check your credentials and try again.",
        variant: "destructive",
        action : <Link href="/sign-up" className={buttonVariants({variant: "default"})}>Create Account</Link>
      })
    }
    else if(signInData?.error){
      return toast({
        title: "Error",
        description: signInData.error,
        variant: "destructive",
      })
    }
    else if(signInData?.ok){
      return router.push("/dashboard");
    }

  };

  return (
    <Card className="rounded-xl md:py-12 py-8 md:mt-0  mt-16 px-6 md:px-44 dark:bg-[rgb(15,15,15)] bg-neutral-200 border dark:border-[rgb(162,162,162)]/20 border-black">
      <div className="space-y-2 text-center pb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Sign In
        </h1>
        <p className="text-gray-500 dark:text-muted-foreground">
          Enter your information to continue
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-[80vw]">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="md:w-[500px] w-[300px]"
                    placeholder="Ex: Suyash Patil"
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
                <FormLabel>USN / Ph No</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 1NH22AI170" {...field} />
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
          <div className="flex flex-col gap-4">
            <Button type="submit" isLoading={form.formState.isSubmitting} className="w-full">
              {" "}
              Submit
            </Button>
            <Link
              href="/sign-up"
              className="text-center text-muted-foreground font-semibold"
            >
              Don&apos;t have an account? SignUp
            </Link>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default SignIn;

