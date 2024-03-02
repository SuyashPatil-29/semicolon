"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import JoinClassRoomForm from "./JoinClassRoomForm";
import { LoadingState } from "./LoadingState";
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

