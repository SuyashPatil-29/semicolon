import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { ClassroomWithDetails } from "./UserData";
import JoinClassroomDialog from "./JoinClassroomDialog";
import { LoadingState } from "./LoadingState";
import {
  NewClassroomWithDetails,
  UserValidator,
} from "@/lib/validators/UserValidator";
import DeleteClassroomDialog from "./DeleteClassroomDialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "./ui/separator";
import LeaveClassroomDialog from "./LeaveClassroomDialog";

type Props = {
  classrooms: NewClassroomWithDetails[];
  userData: UserValidator;
  allClassrooms: ClassroomWithDetails[];
};

function MyClassroom({ classrooms, userData, allClassrooms }: Props) {
  console.log("classrooms", classrooms);
  console.log("userData", userData);
  console.log("allClassrooms", allClassrooms);
  if (!classrooms) {
    return <LoadingState />;
  }
  if (!allClassrooms) {
    return <LoadingState />;
  }
  if (!userData) {
    return <LoadingState />;
  }

  return (
    <div className="pb-14">
      <h1 className="text-xl dark:text-gray-200 text-neutral-700 font-semibold pt-8 pb-4">
        My Classrooms
      </h1>
      <Table>
        <TableCaption className="pb-4">A list of the classrooms you have joined</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left w-1/3">Classroom Name</TableHead>
            <TableHead className="text-center">Created By</TableHead>
            <TableHead className="text-center">Members</TableHead>
            <TableHead className="text-center">Subjects</TableHead>
            <TableHead className="text-center">View</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classrooms &&
            classrooms.map((classroom) => (
              <TableRow key={classroom.classroomId}>
                <TableCell className="text-left font-medium">
                  {classroom.classroom.name}
                </TableCell>
                <TableCell className="text-center">
                  {classroom.classroom.admin.name}
                </TableCell>
                <TableCell className="text-center">
                  {classroom.classroom._count.users}
                </TableCell>
                <TableCell className="text-center">
                  {classroom.classroom.subjects.length}
                </TableCell>
                <TableCell className="text-center">
                  <Link
                    className={cn(
                      buttonVariants({ variant: "link" }),
                      "w-[16.666%] text-center"
                    )}
                    href={`/classrooms/${classroom.classroomId}`}
                  >
                    View
                  </Link>
                </TableCell>
                <TableCell className="text-center">
                  {userData.id === classroom.classroom.adminId ? (
                    userData.access !== "STUDENT" && (
                      <DeleteClassroomDialog
                        classroomId={classroom.classroomId}
                      />
                    )
                  ) : (
                    <LeaveClassroomDialog classroomId={classroom.classroomId} />
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {allClassrooms && allClassrooms.length > classrooms.length && (
        <div className="md:pb-14 pb-6">
          <Separator className="md:my-14 my-6" />
          <h1 className="text-xl dark:text-gray-200 text-neutral-700 font-semibold pb-4">
            All Classrooms
          </h1>
          <Table >
            <TableCaption className="pb-4">A list of the classrooms you can join</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left w-1/3">
                  Classroom Name
                </TableHead>
                <TableHead className="text-center">Created By</TableHead>
                <TableHead className="text-center">Members</TableHead>
                <TableHead className="text-center">Subjects</TableHead>
                <TableHead className="text-center">Join</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allClassrooms &&
                allClassrooms
                  .filter(
                    (ac) => !classrooms.some((c) => c.classroom.id === ac.id)
                  )
                  .map((classroom) => (
                    <TableRow key={classroom.id}>
                      <TableCell className="text-left font-medium">
                        {classroom.name}
                      </TableCell>
                      <TableCell className="text-center">
                        {classroom.admin.name}
                      </TableCell>
                      <TableCell className="text-center">
                        {classroom.users.length}
                      </TableCell>
                      <TableCell className="text-center">
                        {classroom.subjects.length}
                      </TableCell>
                      <TableCell className="text-center">
                        <JoinClassroomDialog
                          classroom={classroom}
                          userId={userData.id}
                          userAccess={userData.access}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default MyClassroom;
