"use client";
import { cn } from "@/lib/utils";
import { OTPInput, SlotProps } from "input-otp";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { toast } from "./ui/use-toast"; // Make sure to import toast if it's defined in another file.
import { redirect } from "next/navigation";

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

const VerifyEmail = ({ user }: VerifyEmailProps) => {
  const [otp, setOtp] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<VerifyEmailProps | null | undefined>(null);

  const handleComplete = async () => {
    if (otp?.toString() !== user.code.toString()) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid OTP",
        variant: "destructive",
      });
      return;
    } else {
      try {
        const { data } = await axios.post("/api/sign-up", user);
        console.log("data", data);
        if (data) {
          setNewUser(data);
          return toast({
            title: "Account created.",
            description: "We've created your account for you.",
            variant: "default",
          });
        }
      } catch (error: AxiosError | any | undefined) {
        console.log("error", error);
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
  };

  if (newUser) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex flex-col gap-8 items-center justify-center">
      <h1 className="text-2xl font-semibold">
        Enter the OTP sent to {user.email}
      </h1>
      <OTPInput
        maxLength={6}
        containerClassName="group flex items-center has-[:disabled]:opacity-30"
        onComplete={handleComplete}
        onChange={setOtp}
        render={({ slots }) => (
          <>
            <div className="flex">
              {slots.slice(0, 3).map((slot, idx) => (
                <Slot key={idx} {...slot} />
              ))}
            </div>

            <FakeDash />

            <div className="flex">
              {slots.slice(3).map((slot, idx) => (
                <Slot key={idx} {...slot} />
              ))}
            </div>
          </>
        )}
      />

      <p>Once you enter the otp the process will continue automatically. Please do not refresh</p>
    </div>
  );
};

export default VerifyEmail;

// Slot and FakeDash functions should be defined outside of VerifyEmail component.
function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "relative w-10 h-14 text-[2rem]",
        "flex items-center justify-center",
        "transition-all duration-200",
        "border-border border-y border-r first:border-l first:rounded-l-md last:rounded-r-md",
        "group-hover:border-white group-focus-within:border-accent-foreground/20",
        "outline outline-1 outline-muted-foreground",
        { "outline-4 dark:outline-yellow-700 outline-yellow-600": props.isActive }
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  );
}

function FakeCaret() {
  return (
    <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
      <div className="w-px h-8 bg-white" />
    </div>
  );
}

function FakeDash() {
  return (
    <div className="flex w-8 justify-center items-center">
      <div className="w-3 h-1 rounded-full bg-muted-foreground" />
    </div>
  );
}

