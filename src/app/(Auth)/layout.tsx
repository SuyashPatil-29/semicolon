import AuthNavbar from "@/components/AuthNavbar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const layout = async ({ children }: Props) => {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="dark:bg-[rgb(28,28,28)] min-h-screen min-w-[100vw]">
      <AuthNavbar user={session?.user} />
      <div className="h-screen w-[100vw] flex justify-center items-center pt-14">{children}</div>
    </div>
  );
};

export default layout;
