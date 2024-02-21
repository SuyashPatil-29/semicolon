"use client";
import { AimlFileUploadRequest } from "@/lib/validators/AimlFileUploadValidator";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react"; // Import useEffect
import { Input } from "./ui/input";
import FileUploadDialog from "./FileUploadDialog";
import { User } from "@prisma/client";
import { Pick } from "@prisma/client/runtime/library";
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
import { EmptyAlert } from "./EmptyAlert";
import { Separator } from "@/components/ui/separator";
import { LoadingState } from "./LoadingState";
import { buttonVariants } from "./ui/button";

type Props = {
  user: Pick<User, "name" | "id" | "usn" | "access">;
};

const FileTable = ({ user }: Props) => {
  const { data: files, isLoading, isFetching, isError } = useQuery({
    queryKey: ["files"],
    queryFn: async () => {
      const { data } = await axios.get("/api/aiml-library");
      return data as AimlFileUploadRequest[];
    },
    refetchIntervalInBackground: true,
    refetchInterval: 1000,
  });

  const [filteredFiles, setFilteredFiles] = React.useState<AimlFileUploadRequest[] | null>(null);
  const [searchStarted, setSearchStarted] = React.useState(false); // State to track if search has started

  console.log("files", files);

  // Use useEffect to update filteredFiles when files data changes
  useEffect(() => {
    setFilteredFiles(files!);
  }, [files]);

  return (
    <div>
      <Separator />
      <div className="flex items-center gap-2.5 pt-10 pb-6 justify-between">
        <Input
          className="flex-1 h-11 dark:bg-[rgb(40,40,40)] bg-neutral-200"
          placeholder="Start typing to search..."
          onChange={(e) => {
            setSearchStarted(true); // Set search started to true on change
            setFilteredFiles(
              files?.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()).filter(
                (file) =>
                  file.name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                  file.uploadedBy
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
              ) as AimlFileUploadRequest[]
            );
          }}
        />
        <FileUploadDialog user={user} />
      </div>

      {isError ? (
        <ErrorAlert />
      ) : searchStarted && filteredFiles && filteredFiles.length === 0 ? (
        <EmptyAlert />
      ) : filteredFiles && filteredFiles.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">Name</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Uploaded By</TableHead>
              <TableHead className="text-center">Download</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFiles.map(({ name, fileUrl, uploadedAt, uploadedBy }, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium w-1/2">{name}</TableCell>
                <TableCell className="text-center">{formatDate(uploadedAt)}</TableCell>
                <TableCell className="text-center">{uploadedBy}</TableCell>
                <TableCell className="text-center">
                  <a href={fileUrl} target="_blank" className={cn(buttonVariants({variant: "link"}), "w-fit" )}>
                    Download
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : searchStarted ? ( // Check if search has started and no files match the search
        <EmptyAlert />
      ) : (
        <LoadingState />
      )}
    </div>
  );
};

export default FileTable;