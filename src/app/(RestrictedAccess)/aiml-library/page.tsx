import FileTable from "@/components/FileTable";
import FileUploadDialog from "@/components/FileUploadDialog";
import { Input } from "@/components/ui/input";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

const page = async (props: Props) => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen pt-24">
      <h1 className="text-3xl font-semibold">AIML LIBRARY</h1>
      <FileTable user={session?.user} />
    </div>
  );
};

export default page;
