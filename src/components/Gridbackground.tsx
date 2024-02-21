"use client"
import { CardStack } from "@/components/CardStack";
import MarketingNavbar from "@/components/MarketingNavbar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export default function GridBackgroundDemo() {
  const CARDS = [
    {
      id: 0,
      name: "Manu Arora",
      designation: "Senior Software Engineer",
      content: (
        <p>
          These cards are amazing, <h1>I want to use them</h1> in my project.
          Framer motion is a godsend ngl tbh fam 🙏
        </p>
      ),
    },
    {
      id: 1,
      name: "Elon Musk",
      designation: "Senior Shitposter",
      content: (
        <p>
          I dont like this Twitter thing, <h1>deleting it right away</h1>{" "}
          because yolo. Instead, I would like to call it <h1>X.com</h1> so that
          it can easily be confused with adult sites.
        </p>
      ),
    },
    {
      id: 2,
      name: "Tyler Durden",
      designation: "Manager Project Mayhem",
      content: (
        <p>
          The first rule of
          <h1>Fight Club</h1> is that you do not talk about fight club. The
          second rule of
          <h1>Fight club</h1> is that you DO NOT TALK about fight club.
        </p>
      ),
    },
  ];

  return (
    <div className="h-[100vh] w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <MarketingNavbar />
      <div className="grid grid-cols-2 px-20">
        <div className="flex flex-col gap-6">
          <p className="text-4xl sm:text-6xl font-black relative z-20 dark:text-white text-black">
            A better alternative for Google Classroom.
          </p>
          <p className="text-2xl dark:text-muted-foreground font-semibold text-gray-500">
            Manage files and resources in one place for your class with ease.
          </p>
          <div className="flex gap-5 w-full">
            <Link
              href="/teacher/sign-up"
              className={cn(
                buttonVariants(),
                "w-1/3 dark:bg-white bg-black rounded-lg font-semibold"
              )}
            >
              Teacher Sign Up
            </Link>
            <Link
              href="/sign-up"
              className={cn(
                buttonVariants(),
                "w-1/3 dark:bg-white bg-black rounded-lg font-semibold"
              )}
            >
              Student Sign Up
            </Link>
          </div>
          <p className="pl-[470px] font-semibold dark:text-white text-black text-xl">
            By ~{" "}
            <span className="underline">
              <a target="_blank" href="https://dev-suyash.vercel.app/">
                Suyash Patil
              </a>
            </span>
          </p>
        </div>
        <div className="h-[40rem] flex items-center justify-center w-full">
          <CardStack items={CARDS} />
        </div>
      </div>
    </div>
  );
}

