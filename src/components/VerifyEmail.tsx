"use client";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { toast } from "./ui/use-toast"; // Make sure to import toast if it's defined in another file.
import { redirect } from "next/navigation";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type VerifyEmailProps = {
  user: {
    code: string;
    confirmPassword: string;
    email: string;
    password: string;
    username: string;
    usn: string;
  };
};

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const VerifyEmail = ({ user }: VerifyEmailProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const [newUser, setNewUser] = useState<VerifyEmailProps | null | undefined>(
    null
  );

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.pin !== user.code.toString()) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid OTP",
        variant: "destructive",
      });
      return;
    } else {
      try {
        const { data } = await axios.post("/api/sign-up", user);
        if (data) {
          setNewUser(data);
          return toast({
            title: "Account created.",
            description: "We've created your account for you.",
            variant: "default",
          });
        }
      } catch (error: AxiosError | any | undefined) {
        if (error.response.status === 409) {
          return toast({
            title: "Account already exists",
            description: error.response.data,
            variant: "destructive",
            action: (
              <Link href="/sign-in" className={buttonVariants()}>
                Login
              </Link>
            ),
          });
        } else if (error.response.status === 422) {
          return toast({
            title: "Passwords do not match",
            description: "Please enter the same password in both fields.",
            variant: "destructive",
          });
        } else {
          return toast({
            title: "Something went wrong",
            description: "Please try again later.",
            variant: "destructive",
          });
        }
      }
    }
  }

  if (newUser) {
    return redirect("/sign-in");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl font-semibold">One-Time Password</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  render={({ slots }) => (
                    <InputOTPGroup>
                      {slots.map((slot, index) => (
                        <InputOTPSlot key={index} {...slot} />
                      ))}{" "}
                    </InputOTPGroup>
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-muted-foreground">
                Please enter the one-time password sent to {user.email}.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting} isLoading={form.formState.isSubmitting}>Submit</Button>
      </form>
    </Form>
  );
};

export default VerifyEmail;
