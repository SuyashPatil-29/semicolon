"use client";
import { UserValidator } from "@/lib/validators/UserValidator";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import JoinClassRoomForm from "./JoinClassRoomForm";
import { Classroom, Subject, User } from "@prisma/client";
import { LoadingState } from "./LoadingState";
import MyClassroom from "./MyClassroom";
import StudentClassroom from "./StudentClassroom";
import { EmptyAlert } from "./EmptyAlert";
import Image from "next/image";

type Props = {};
export type ClassroomWithDetails = Classroom & {
  admin: User;
  adminId: string;
  created_at: string;
  id: string;
  name: string;
  subjects: Subject[];
  users: User[];
};

const UserData = (props: Props) => {
  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const { data } = await axios.get("/api/user");
      return data as UserValidator;
    },
  });

  const { data: classrooms } = useQuery({
    queryKey: ["classroomData"],
    queryFn: async () => {
      const { data } = await axios.get("/api/classroom");
      return data as ClassroomWithDetails[];
    },
  });

  console.log(userData);
  if (!classrooms) return <LoadingState />;
  if (!userData?.classrooms) return (<div className="flex flex-col gap-8 w-full items-center mt-24">
      <Image
        alt="an image of a picture and directory icon"
        width="300"
        height="300"
        src="/empty.svg"
      />
      <p className="text-2xl">You don&apos;t have any classroom. Please join a classroom</p>
    </div>
  )

  return (
    <div>
      {userData?.classrooms.length === 0 ? (
        <JoinClassRoomForm classrooms={classrooms} userData={userData} />
      ) : (
        <>
          {userData?.access === "STUDENT" ? (
            <StudentClassroom userData={userData} />
          ) : (
            <MyClassroom
              classrooms={userData?.classrooms}
              userData={userData!}
              allClassrooms={classrooms}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserData;
