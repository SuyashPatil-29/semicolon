"use client";
import { UserValidator } from "@/lib/validators/UserValidator";
import { ClassroomWithDetails } from "./UserData";
import JoinClassroomDialog from "./JoinClassroomDialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  classrooms: ClassroomWithDetails[];
  userData: UserValidator;
};

const JoinClassRoomForm = ({ classrooms, userData }: Props) => {
  console.log("classrooms", classrooms);
  return (
    <div className="pt-10 pb-14">
      <div className="flex items-center justify-between">
        <h1 className="md:text-xl text-lg font-medium dark:text-gray-300 text-neutral-700">
          Looks like you haven&apos;t joined a classroom yet. Let&apos;s get you
          started.
        </h1>
      </div>
      <p className="text-muted-foreground md:text-sm text-xs pb-8">
        Click on the classroom you want to join {userData.access !== "STUDENT" && <span>or create one.</span>}
      </p>
      {classrooms.length > 0 && (
      <Table>
        <TableCaption>A list of the classrooms you can join</TableCaption>
        <TableHeader>
          <TableRow> 
            <TableHead className="text-left w-1/3">Classroom Name</TableHead>
            <TableHead className="text-center">Created By</TableHead>
            <TableHead className="text-center">Members</TableHead>
            <TableHead className="text-center">Subjects</TableHead>
            <TableHead className="text-center">Join</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classrooms &&
            classrooms.map((classroom) => (
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
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      )}
    </div>
  );
};

export default JoinClassRoomForm;
