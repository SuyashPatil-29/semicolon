"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";
import { cn } from "../lib/utils";
import { buttonVariants } from "./ui/button";

interface Props extends LinkProps {
  children?: ReactNode;
  className?: string;
  linkto?: string;
}

const NavItem = ({ ...props }: Props) => {
  const url = usePathname();

  return (
    <Link
      className={cn(buttonVariants({ variant: "link" }),
        "dark:text-[rgb(195,194,194)] md:text-base text-xl dark:hover:text-white w-[100px] text-neutral-600 hover:text-black",
        url.includes(props.linkto!) && "dark:text-white text-black"
      )}
      {...props}
    >
      {props.children}
    </Link>
  );
};

export default NavItem;
