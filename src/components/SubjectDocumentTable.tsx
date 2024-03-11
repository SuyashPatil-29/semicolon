"use client";
import { AimlFileUploadRequest } from "@/lib/validators/AimlFileUploadValidator";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import { Input } from "./ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatDate } from "@/lib/utils";
import { ErrorAlert } from "./ErrorAlert";
import { buttonVariants } from "./ui/button";
import DocumentUploadDialog from "./DocumentUploadDialog";
import { access } from "@prisma/client";
import DeleteFileDialog from "./DeleteFileDialog";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DownloadIcon } from "lucide-react";

type Props = {
  subjectId: string;
  classroomId: string;
  userName: string;
  userAccess: access;
  userId: string;
  className: string;
  subjectName: string;
};

const SubjectDocumentTable = ({
  subjectId,
  classroomId,
  userName,
  userAccess,
  userId,
  className,
  subjectName,
}: Props) => {
  const router = useRouter();
  const { data: files, isError } = useQuery({
    queryKey: ["files"],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`/api/subject/${subjectId}`);
        return data.documents as AimlFileUploadRequest[];
      } catch (error: any) {
        if (
          error.response.status === 401 ||
          error.response.data === "User is not a member"
        ) {
          toast({
            description:
              "You are not authorized to access this classroom. Join the classroom to access it.",
            variant: "destructive",
          });
          router.push(`/dashboard`);
        }
      }
    },
    refetchIntervalInBackground: true,
    refetchInterval: 1000,
  });

  const [filteredFiles, setFilteredFiles] = React.useState<
    AimlFileUploadRequest[] | null
  >(null);
  const [searchStarted, setSearchStarted] = React.useState(false);

  useEffect(() => {
    setFilteredFiles(files!);
  }, [files]);

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
              <BreadcrumbLink href={`/classrooms/${classroomId}`}>
                {className}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="md:text-xl md:font-semibold text-lg font-medium">
              <BreadcrumbPage>{subjectName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Separator />
      <div className="flex items-center gap-2.5 pt-10 pb-6 justify-between">
        <Input
          className="flex-1 dark:bg-[rgb(23,23,23)] bg-neutral-200"
          placeholder="Start typing to search..."
          onChange={(e) => {
            setSearchStarted(true);
            setFilteredFiles(
              files?.filter(
                (file) =>
                  file.name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                  file.uploadedBy
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
              ) || null
            );
          }}
        />
        {userAccess !== "STUDENT" && (
          <DocumentUploadDialog
            subjectId={subjectId}
            classroomId={classroomId}
            userName={userName}
          />
        )}
      </div>

      {isError ? (
        <ErrorAlert />
      ) : (searchStarted && filteredFiles && filteredFiles.length === 0) ||
        files?.length === 0 ? (
        <div className="flex flex-col gap-8 w-full items-center mt-24">
          <Image
            alt="an image of a picture and directory icon"
            width="300"
            height="300"
            src="/empty.svg"
          />
          <div className="text-2xl text-center">
            No documents uploaded. Please come back later
          </div>
        </div>
      ) : filteredFiles && filteredFiles.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">Name</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Uploaded By</TableHead>
              <TableHead className="text-center">Download</TableHead>
              {userAccess !== "STUDENT" && (
                <TableHead className="text-center">Action</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFiles.map(
              (
                {
                  name,
                  fileUrl,
                  uploadedAt,
                  uploadedBy,
                  userId: fileUserId,
                  id,
                },
                i
              ) => (
                <TableRow key={i}>
                  <TableCell className="font-medium w-1/2">{name}</TableCell>
                  <TableCell className="text-center">
                    {formatDate(uploadedAt)}
                  </TableCell>
                  <TableCell className="text-center">{uploadedBy}</TableCell>
                  <TableCell className="text-center">
                    <a
                      href={fileUrl}
                      target="_blank"
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "w-fit"
                      )}
                    >
                      <DownloadIcon className="w-5 h-5" />
                    </a>
                  </TableCell>
                  <TableCell className="text-center">
                    {fileUserId === userId && (
                      <DeleteFileDialog
                        fileUrl={fileUrl}
                        subjectId={subjectId}
                        fileId={id!}
                      />
                    )}
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      ) : searchStarted ? (
        <div className="flex flex-col gap-8 w-full items-center mt-24">
          <Image
            alt="an image of a picture and directory icon"
            width="300"
            height="300"
            src="/empty.svg"
          />
          <div className="text-2xl text-center">
            No documents uploaded. Please come back later
          </div>
        </div>
      ) : (
        <LoadingState />
      )}
    </div>
  );
};

export default SubjectDocumentTable;


import { Skeleton, SVGSkeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => (
  <>
    <div className="relative w-full overflow-auto">
      <table className="w-full caption-bottom">
        <thead className="[&amp;_tr]:border-b">
          <tr className="border-b transition-colors">
            <th className="h-12 px-4 text-left align-middle [&amp;:has([role=checkbox])]:pr-0 w-1/2">
              <Skeleton className="w-[32px] max-w-full" />
            </th>
            <th className="h-12 px-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <Skeleton className="w-[32px] max-w-full" />
            </th>
            <th className="h-12 px-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <Skeleton className="w-[88px] max-w-full" />
            </th>
            <th className="h-12 px-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <Skeleton className="w-[64px] max-w-full" />
            </th>
          </tr>
        </thead>
        <tbody className="[&amp;_tr:last-child]:border-0">
          <tr className="border-b transition-colors">
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 w-1/2">
              <Skeleton className="w-[176px] max-w-full" />
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <Skeleton className="w-[96px] max-w-full" />
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <Skeleton className="w-[48px] max-w-full" />
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <a className="inline-flex items-center justify-center transition-colors h-10 px-4 py-2 w-fit">
                <SVGSkeleton className="w-[24px] h-[24px]" />
              </a>
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0"></td>
          </tr>
          <tr className="border-b transition-colors">
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 w-1/2">
              <Skeleton className="w-[112px] max-w-full" />
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <Skeleton className="w-[96px] max-w-full" />
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <Skeleton className="w-[48px] max-w-full" />
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <a className="inline-flex items-center justify-center transition-colors h-10 px-4 py-2 w-fit">
                <SVGSkeleton className="w-[24px] h-[24px]" />
              </a>
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0"></td>
          </tr>
          <tr className="border-b transition-colors">
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 w-1/2">
              <Skeleton className="w-[112px] max-w-full" />
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <Skeleton className="w-[96px] max-w-full" />
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <Skeleton className="w-[48px] max-w-full" />
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <a className="inline-flex items-center justify-center transition-colors h-10 px-4 py-2 w-fit">
                <SVGSkeleton className="w-[24px] h-[24px]" />
              </a>
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0"></td>
          </tr>
          <tr className="border-b transition-colors">
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 w-1/2">
              <Skeleton className="w-[128px] max-w-full" />
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <Skeleton className="w-[96px] max-w-full" />
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <Skeleton className="w-[48px] max-w-full" />
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <a className="inline-flex items-center justify-center transition-colors h-10 px-4 py-2 w-fit">
                <SVGSkeleton className="w-[24px] h-[24px]" />
              </a>
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </>
);

const LoadingState = () => (
  <div className="w-full h-full">
    <LoadingSkeleton />
  </div>
);

