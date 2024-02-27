"use client";
import { AimlFileUploadRequest } from "@/lib/validators/AimlFileUploadValidator";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import { Input } from "./ui/input";
import { EmptyAlert } from "./EmptyAlert";
import { Separator } from "@/components/ui/separator";
import { LoadingState } from "./LoadingState";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, formatDate } from "@/lib/utils";
import { ErrorAlert } from "./ErrorAlert";
import { buttonVariants } from "./ui/button";
import DocumentUploadDialog from "./DocumentUploadDialog";
import { access } from "@prisma/client";
import Link from "next/link";
import DeleteFileDialog from "./DeleteFileDialog";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";

type Props = {
  subjectId: string;
  classroomId: string;
  userName : string;
  userAccess: access;
  userId : string;
  className : string;
  subjectName :string;
};

const SubjectDocumentTable = ({ subjectId, classroomId,userName,userAccess,userId, className , subjectName }: Props) => {
  const router = useRouter();
  const { data: files, isError } = useQuery({
    queryKey: ["files"],
    queryFn: async () => {
      try {
      const { data } = await axios.get(`/api/subject/${subjectId}`);
      return data.documents as AimlFileUploadRequest[];
      } catch (error : any) {
        if(error.response.status === 401 || error.response.data === "User is not a member"){
          toast({
            description: "You are not authorized to access this classroom. Join the classroom to access it.",
            variant: "destructive",
          });
          router.push(`/dashboard`);
        } 
      }
    },
    refetchIntervalInBackground: true,
    refetchInterval: 1000,
  });

  const [filteredFiles, setFilteredFiles] = React.useState<AimlFileUploadRequest[] | null>(null);
  const [searchStarted, setSearchStarted] = React.useState(false);

  console.log("files", files);

  useEffect(() => {
    setFilteredFiles(files!);
  }, [files]);

  return (
    <div>
      <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold">{<Link className="hover:underline underline-offset-4" href={`/classrooms/${classroomId}`}>{className}</Link>} {'>'} {subjectName}</h1>

      <Link href={`/classrooms/${classroomId}`}>
        <button
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Back to classroom
        </button>
      </Link>

      </div>
      <Separator />
      <div className="flex items-center gap-2.5 pt-10 pb-6 justify-between">
        <Input
          className="flex-1 dark:bg-[rgb(40,40,40)] bg-neutral-200"
          placeholder="Start typing to search..."
          onChange={(e) => {
            setSearchStarted(true);
            setFilteredFiles(
              files?.filter((file) =>
                file.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                file.uploadedBy.toLowerCase().includes(e.target.value.toLowerCase())
              ) || null
            );
          }}
        />
        {userAccess !== "STUDENT" && <DocumentUploadDialog subjectId={subjectId} classroomId={classroomId} userName={userName}/>}
      </div>

      {isError ? (
        <ErrorAlert />
      ) : searchStarted && filteredFiles && filteredFiles.length === 0 || files?.length === 0  ? (
        <EmptyAlert message="No files found" />
      ) : filteredFiles && filteredFiles.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">Name</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Uploaded By</TableHead>
              <TableHead className="text-center">Download</TableHead>
              <TableHead className="text-center">Action</TableHead>    
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFiles.map(({ name, fileUrl, uploadedAt, uploadedBy, userId:fileUserId, id }, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium w-1/2">{name}</TableCell>
                <TableCell className="text-center">{formatDate(uploadedAt)}</TableCell>
                <TableCell className="text-center">{uploadedBy}</TableCell>
                <TableCell className="text-center">
                  <a href={fileUrl} target="_blank" className={cn(buttonVariants({ variant: "link" }), "w-fit")}>
                    Download
                  </a>
                </TableCell>
                <TableCell className="text-center">
                  {fileUserId === userId && <DeleteFileDialog fileUrl={fileUrl} subjectId={subjectId} fileId={id!}/>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : searchStarted ? (
        <EmptyAlert message="No files found" />
      ) : (
        <LoadingState />
      )}
    </div>
  );
};

export default SubjectDocumentTable;
