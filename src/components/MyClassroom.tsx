import React, { useState } from "react";
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
import { Input } from "./ui/input";
import Image from "next/image";

type Props = {
  classrooms: NewClassroomWithDetails[];
  userData: UserValidator;
  allClassrooms: ClassroomWithDetails[];
};

function MyClassroom({ classrooms, userData, allClassrooms }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter classrooms based on search query
  const filteredClassrooms = classrooms.filter((classroom) =>
    classroom.classroom.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter allClassrooms based on search query and exclude already joined classrooms
  const filteredAllClassrooms = allClassrooms.filter(
    (ac) =>
      !classrooms.some((c) => c.classroom.id === ac.id) &&
      ac.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!classrooms || !allClassrooms || !userData) {
    return <LoadingState />;
  }

  return (
    <div className="pb-14">
      <h1 className="text-xl dark:text-gray-200 text-neutral-700 font-semibold pt-8 pb-4">
        My Classrooms
      </h1>
      <Input
        className="flex-1 dark:bg-[rgb(23,23,23)] bg-neutral-200 my-4"
        placeholder="Start typing to search..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {filteredClassrooms.length > 0 && (
        <div>
          <Table>
            <TableCaption className="pb-4">
              A list of the classrooms you have joined
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left w-1/3">
                  Classroom Name
                </TableHead>
                <TableHead className="text-center">Created By</TableHead>
                <TableHead className="text-center">Members</TableHead>
                <TableHead className="text-center">Subjects</TableHead>
                <TableHead className="text-center">View</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClassrooms.map((classroom) => (
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
                        "w-[16.666%] text-center hover:underline underline-offset-4"
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
                      <LeaveClassroomDialog
                        classroomId={classroom.classroomId}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {filteredClassrooms.length === 0 &&
        filteredAllClassrooms.length === 0 && (
          <div className="flex flex-col gap-8 w-full items-center mt-24">
            <Image
              alt="an image of a picture and directory icon"
              width="300"
              height="300"
              src="/empty.svg"
            />
            <p className="text-2xl text-center">
              You don&apos;t have any classroom. Please join a classroom
            </p>
          </div>
        )}
      {filteredClassrooms.length > 0 && filteredAllClassrooms.length > 0 && (
        <Separator className="md:my-14 my-6" />
      )}
      {filteredAllClassrooms.length > 0 && (
        <div className="md:pb-14 pb-6">
          <h1 className="text-xl dark:text-gray-200 text-neutral-700 font-semibold pb-4">
            All Classrooms
          </h1>
          <Table>
            <TableCaption className="pb-4">
              A list of the classrooms you can join
            </TableCaption>
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
              {filteredAllClassrooms.map((classroom) => (
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
