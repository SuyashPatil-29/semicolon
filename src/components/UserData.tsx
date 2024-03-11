"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import JoinClassRoomForm from "./JoinClassRoomForm";
import { Skeleton, SVGSkeleton } from "@/components/ui/skeleton";
import MyClassroom from "./MyClassroom";
import StudentClassroom from "./StudentClassroom";
import { UserValidator } from "@/lib/validators/UserValidator";
import { Classroom, Subject, User } from "@prisma/client";

export type ClassroomWithDetails = Classroom & {
  admin: User;
  adminId: string;
  created_at: string;
  id: string;
  name: string;
  subjects: Subject[];
  users: User[];
};

const UserData = () => {
  const { data: userData, isLoading: isUserLoading } = useQuery<UserValidator>({
    queryKey: ["userData"],
    queryFn: async () => {
      const { data } = await axios.get("/api/user");
      return data;
    },
  });

  const { data: classrooms, isLoading: isClassroomLoading } = useQuery<ClassroomWithDetails[]>({
    queryKey: ["classroomData"],
    queryFn: async () => {
      const { data } = await axios.get("/api/classroom");
      return data;
    },
  });

  if (isUserLoading || isClassroomLoading) return <LoadingState />;

  if (!classrooms || classrooms.length === 0) {
    // Render the image and JoinClassRoomForm when no classrooms exist
    return (
      <div className="flex flex-col gap-8 w-full items-center mt-24">
        <Image
          alt="an image of a picture and directory icon"
          width="300"
          height="300"
          src="/empty.svg"
        />
        <p className="text-2xl text-center">You don&apos;t have any classroom. Please join a classroom</p>
      </div>
    );
  }

  if (!userData?.classrooms || userData.classrooms.length === 0) {
    // Render JoinClassRoomForm when userData.classrooms is empty
    return <JoinClassRoomForm classrooms={classrooms} userData={userData!} />;
  }

  // Render MyClassroom or StudentClassroom based on user's access
  return (
    <div>
      {userData.access === "STUDENT" ? (
        <StudentClassroom userData={userData} />
      ) : (
        <MyClassroom
          classrooms={userData.classrooms}
          userData={userData}
          allClassrooms={classrooms}
        />
      )}
    </div>
  );
};

export default UserData;

const LoadingSkeleton = () => {
  // Create an array with a length of 5 for five rows
  const rows = Array.from({ length: 3 });

  return (
    <>
      <div className="pb-14">
        <h1 className="pt-8 pb-4">
          <Skeleton className="w-[104px] max-w-full" />
        </h1>
        <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0 flex-1 my-4">
          <Skeleton className="w-[200px] max-w-full" />
        </div>
        <div>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom">
              <caption className="mt-4 pb-4">
                <Skeleton className="w-[320px] max-w-full" />
              </caption>
              <thead className="[&amp;_tr]:border-b">
                <tr className="border-b transition-colors">
                  <th className="h-12 px-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-left w-1/3">
                    <Skeleton className="w-[112px] max-w-full" />
                  </th>
                  <th className="h-12 px-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                    <Skeleton className="w-[80px] max-w-full" />
                  </th>
                  <th className="h-12 px-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                    <Skeleton className="w-[56px] max-w-full" />
                  </th>
                  <th className="h-12 px-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                    <Skeleton className="w-[64px] max-w-full" />
                  </th>
                  <th className="h-12 px-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                    <Skeleton className="w-[32px] max-w-full" />
                  </th>
                  <th className="h-12 px-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                    <Skeleton className="w-[48px] max-w-full" />
                  </th>
                </tr>
              </thead>
              <tbody className="[&amp;_tr:last-child]:border-0">
                {/* Map over the array to generate multiple rows */}
                {rows.map((_, index) => (
                  <tr key={index} className="border-b transition-colors">
                    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-left">
                      <Skeleton className="w-[56px] max-w-full" />
                    </td>
                    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                      <Skeleton className="w-[48px] max-w-full" />
                    </td>
                    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                      <Skeleton className="w-[16px] max-w-full" />
                    </td>
                    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                      <Skeleton className="w-[14px] max-w-full" />
                    </td>
                    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                      <a className="w-[16.666%]">
                        <Skeleton className="w-[32px] max-w-full" />
                      </a>
                    </td>
                    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                      <div className="inline-flex items-center justify-center transition-colors h-10 px-4 py-2">
                        <SVGSkeleton className="w-[24px] h-[24px]" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

const LoadingState = () => (
  <div className="w-full h-full">
    <LoadingSkeleton />
  </div>
);

