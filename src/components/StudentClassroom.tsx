import { UserValidator } from "@/lib/validators/UserValidator";
import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LeaveClassroomDialog from "./LeaveClassroomDialog";
import { Card } from "./ui/card";

type Props = {
  userData: UserValidator;
};

const StudentClassroom = ({ userData }: Props) => {
  return (
    <div className="pb-14">
      <h1 className="text-xl dark:text-gray-200 text-neutral-700 font-semibold pt-8 pb-4">
        My Classrooms
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left w-1/3">Classroom Name</TableHead>
            <TableHead className="text-center">Created By</TableHead>
            <TableHead className="text-center">Members</TableHead>
            <TableHead className="text-center">Subjects</TableHead>
            <TableHead className="text-center">Action</TableHead>
            <TableHead className="text-center">Leave</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userData.classrooms &&
            userData.classrooms.map((classroom) => (
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
                      "w-[16.666%] text-center hover:underline underline-offset-4", 
                    )}
                    href={`/classrooms/${classroom.classroomId}`}
                  >
                    View
                  </Link>
                </TableCell>
                <TableCell className="text-center">
                  <LeaveClassroomDialog classroomId={classroom.classroomId} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <h1 className="text-xl dark:text-gray-200 text-neutral-700 font-semibold pt-8 pb-4">
        My Subjects
      </h1>
      <div className="grid grid-cols-3 gap-4">
        {userData.classrooms.length !== 0 &&
          userData.classrooms[0].classroom.subjects.map((subject) => (
            <Link
              href={`/classrooms/${subject.classroomId}/${subject.id}`}
              className="cursor-pointer border-white border rounded-xl"
              key={subject.id}
            >
              <Card className="flex flex-col items-start justify-start p-8 rounded-xl dark:bg-[rgb(17,17,17)]/100">
                <h1 className="text-xl font-bold">{subject.name}</h1>
                <h1 className="text-base">
                </h1>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default StudentClassroom;
