import MarketingNavbar from "@/components/MarketingNavbar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function GridBackgroundDemo() {
  return (
    <div className="h-[100vh] w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <MarketingNavbar />
      <div className="md:flex md:px-20 px-4 gap-10 items-center justify-between">
        <div className="flex flex-col gap-6 md:w-[60%] w-full">
          <p className="text-3xl md:text-5xl xl:text-6xl font-black relative z-20 dark:text-white text-black">
            A better alternative for Google Classroom.
          </p>
          <p className="md:text-2xl dark:text-muted-foreground font-semibold text-gray-500">
            Manage files and resources in one place for your class with ease.
          </p>
          <div className="flex gap-5 w-full">
            <Link
              href="/teacher/sign-up"
              className={cn(
                buttonVariants(),
                "w-1/3 dark:bg-white bg-black rounded-lg font-semibold",
              )}
            >
              Teacher Sign Up
            </Link>
            <Link
              href="/sign-up"
              className={cn(
                buttonVariants(),
                "w-1/3 dark:bg-white bg-black rounded-lg font-semibold",
              )}
            >
              Student Sign Up
            </Link>
          </div>
          <p className="md:pl-[440px] font-semibold dark:text-white text-black md:text-lg text-base whitespace-nowrap">
            By ~{" "}
            <span className="underline">
              <a target="_blank" href="https://dev-suyash.vercel.app/">Suyash Patil</a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <GridBackgroundDemo />
    </>
  );
}
