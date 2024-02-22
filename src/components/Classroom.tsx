"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "./LoadingState";
import { Separator } from "./ui/separator";
import CreateSubjectDialog from "./CreateSubjectDialog";
import Link from "next/link";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { EmptyAlert } from "./EmptyAlert";
import UserData from "./UserData";

type Props = {
  classroomId: string;
  user: {
    name: string;
    usn: string;
    id: string;
    access: string;
  };
};

type ExtendedSubject = {
  classroomId: string;
  documents: { id: string; name: string; }[];
  id: string;
  name: string;
};

type ClassroomWithDetails = {
  admin: {
    id: string;
    name: string;
  };
  adminId: string;
  created_at: string;
  id: string;
  name: string;
  password: string;
  subjects: ExtendedSubject[];
  users: { id: string; name: string; }[];
};

const Classroom = ({ classroomId, user }: Props) => {
  const { data: classroomData, isLoading } = useQuery<ClassroomWithDetails>({
    queryKey: ["classroomData", classroomId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/classroom/${classroomId}`);
      return data;
    },
  });

  const [filteredSubjects, setFilteredSubjects] = useState<ExtendedSubject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (classroomData?.subjects) {
      const filtered = classroomData.subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSubjects(filtered);
    }
  }, [classroomData, searchQuery]);

  if (isLoading || !classroomData) return <LoadingState />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{classroomData.name}</h1>
        {user.access !== "STUDENT" && user.access !== "CR" && <CreateSubjectDialog classroomId={classroomId} />}
      </div>
      <Separator className="mt-3 mb-6" />
      <Input
        className="flex-1 dark:bg-[rgb(40,40,40)] bg-neutral-200"
        placeholder="Start typing to search..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {classroomData.subjects.length === 0 && (
        <div className="mt-6">
          <EmptyAlert message="No subjects found. Come back later or create a new subject." />
        </div>
      )}

      <div className="grid md:grid-cols-3 grid-cols-1 gap-6 mt-6 pb-14">
        {classroomData.subjects.length > 0 && filteredSubjects.map((subject) => (
          <Link
            href={`/classrooms/${classroomId}/${subject.id}`}
            className="cursor-pointer border-white border rounded-xl"
            key={subject.id}
          >
            <Card className="flex flex-col items-start justify-start p-8 rounded-xl dark:bg-[rgb(35,35,35)]/100">
              <h1 className="text-xl font-bold">{subject.name}</h1>
              <h1 className="text-base">Number of Documents: {subject.documents.length}</h1>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Classroom;
