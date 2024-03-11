"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "./ui/separator";
import CreateSubjectDialog from "./CreateSubjectDialog";
import Link from "next/link";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import DeleteClassroomDialog from "./DeleteClassroomDialog";
import LeaveClassroomDialog from "./LeaveClassroomDialog";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
  documents: { id: string; name: string }[];
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
  users: { id: string; name: string }[];
};

const Classroom = ({ classroomId, user }: Props) => {
  const router = useRouter();
  const { data: classroomData, isLoading } = useQuery<ClassroomWithDetails>({
    queryKey: ["classroomData", classroomId],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`/api/classroom/${classroomId}`);
        return data;
      } catch (error: any) {
        if (
          error.response.status === 401 ||
          error.response.data === "User is not a member"
        ) {
          toast({
            title: "Unauthorized",
            description: "You are not authorized to access this classroom",
            variant: "destructive",
          });
          router.push("/dashboard");
        }
      }
    },
  });

  const [filteredSubjects, setFilteredSubjects] = useState<ExtendedSubject[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (classroomData?.subjects) {
      const filtered = classroomData.subjects.filter((subject) =>
        subject.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSubjects(filtered);
    }
  }, [classroomData, searchQuery]);

  if (isLoading || !classroomData) return <LoadingState />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="md:text-xl md:font-semibold text-lg font-medium">
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="md:text-xl md:font-semibold text-lg font-medium">
              <BreadcrumbPage>{classroomData.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-2">
          {user.access !== "STUDENT" && user.access !== "CR" && (
            <CreateSubjectDialog classroomId={classroomId} />
          )}
          {user.id === classroomData.adminId ? (
            <DeleteClassroomDialog classroomId={classroomId} />
          ) : (
            <LeaveClassroomDialog classroomId={classroomId} />
          )}
        </div>
      </div>
      <Separator className="mt-3 mb-6" />
      <Input
        className="flex-1 dark:bg-[rgb(17,17,17)] bg-neutral-200"
        placeholder="Start typing to search..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {classroomData.subjects.length === 0 && (
        <div className="mt-6">
          <div className="flex flex-col gap-8 w-full items-center mt-24">
            <Image
              alt="an image of a picture and directory icon"
              width="300"
              height="300"
              src="/empty.svg"
            />
            <div className="text-2xl text-center">
              No subjects found. Come back later or create a new subject.
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 grid-cols-1 gap-6 mt-6 pb-14">
        {classroomData.subjects.length > 0 &&
          filteredSubjects.map((subject) => (
            <Link
              href={`/classrooms/${classroomId}/${subject.id}`}
              className="cursor-pointer border-white border rounded-xl"
              key={subject.id}
            >
              <Card className="flex flex-col items-start justify-start p-8 rounded-xl dark:bg-[rgb(17,17,17)]/100">
                <h1 className="text-xl font-bold">{subject.name}</h1>
                <h1 className="text-base">
                  Number of Documents: {subject.documents.length}
                </h1>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Classroom;
import { Skeleton, SVGSkeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => (
  <>
    <div>
      <div className="flex items-center justify-between">
        <nav>
          <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
            <li className="inline-flex items-center gap-1.5">
              <a className="transition-colors">
                <Skeleton className="w-[72px] max-w-full" />
              </a>
            </li>
            <li className="[&amp;>svg]:size-3.5">
              <SVGSkeleton className="lucide-chevron-right w-[24px] h-[24px]" />
            </li>
            <li className="inline-flex items-center gap-1.5">
              <span>
                <Skeleton className="w-[56px] max-w-full" />
              </span>
            </li>
          </ol>
        </nav>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center transition-colors h-10 px-4 py-2"></div>
          <div>
            <SVGSkeleton className="w-[24px] h-[24px]" />
          </div>
        </div>
      </div>
      <div className="shrink-0 bg-border h-[1px] w-full mt-3 mb-6"></div>
      <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0 flex-1">
        <Skeleton className="w-[200px] max-w-full" />
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-6 mt-6 pb-14">
        <a className="border-white border">
          <div className="border shadow-sm flex flex-col items-start justify-start p-8">
            <h1>
              <Skeleton className="w-[32px] max-w-full" />
            </h1>
            <h1>
              <Skeleton className="w-[176px] max-w-full" />
            </h1>
          </div>
        </a>
        <a className="border-white border">
          <div className="border shadow-sm flex flex-col items-start justify-start p-8">
            <h1>
              <Skeleton className="w-[24px] max-w-full" />
            </h1>
            <h1>
              <Skeleton className="w-[176px] max-w-full" />
            </h1>
          </div>
        </a>
        <a className="border-white border">
          <div className="border shadow-sm flex flex-col items-start justify-start p-8">
            <h1>
              <Skeleton className="w-[40px] max-w-full" />
            </h1>
            <h1>
              <Skeleton className="w-[176px] max-w-full" />
            </h1>
          </div>
        </a>
        <a className="border-white border">
          <div className="border shadow-sm flex flex-col items-start justify-start p-8">
            <h1>
              <Skeleton className="w-[24px] max-w-full" />
            </h1>
            <h1>
              <Skeleton className="w-[176px] max-w-full" />
            </h1>
          </div>
        </a>
      </div>
    </div>
  </>
);

const LoadingState = () => (
  <div className="w-full h-full">
    <LoadingSkeleton />
  </div>
);
