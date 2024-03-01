import CreateClassroomDialog from "@/components/CreateClassroomDialog";
import UserData from "@/components/UserData";
import { Separator } from "@/components/ui/separator";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const StudentDashboard = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen h-full dark:bg-[rgb(28,28,28)]">
      <div className=" flex items-center justify-between pt-24">
        <h1 className="md:text-3xl text-xl font-semibold">
          Welcome {session?.user?.name},
        </h1>
        {session?.user.access !== "STUDENT" && <CreateClassroomDialog />}
      </div>
      <Separator className="mt-3" />
      <div>
        <UserData />
      </div>
    </div>
  );
};

export default StudentDashboard;
