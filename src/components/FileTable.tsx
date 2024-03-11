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
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "./ui/button";
import Image from "next/image";

type Props = {
  user: Pick<User, "name" | "id" | "usn" | "access">;
};

const FileTable = ({ user }: Props) => {
  const { data: files, isError } = useQuery({
    queryKey: ["files"],
    queryFn: async () => {
      const { data } = await axios.get("/api/aiml-library");
      return data as AimlFileUploadRequest[];
    },
    refetchIntervalInBackground: true,
    refetchInterval: 1000,
  });

  const [filteredFiles, setFilteredFiles] = React.useState<
    AimlFileUploadRequest[] | null
  >(null);
  const [searchStarted, setSearchStarted] = React.useState(false); // State to track if search has started


  // Use useEffect to update filteredFiles when files data changes
  useEffect(() => {
    setFilteredFiles(files!);
  }, [files]);

  return (
    <div>
      <Separator />
      <div className="flex items-center gap-2.5 pt-10 pb-6 justify-between">
        <Input
          className="flex-1 h-11 dark:bg-[rgb(23,23,23)] bg-neutral-200"
          placeholder="Start typing to search..."
          onChange={(e) => {
            setSearchStarted(true); // Set search started to true on change
            setFilteredFiles(
              files
                ?.sort(
                  (a, b) =>
                    new Date(b.uploadedAt).getTime() -
                    new Date(a.uploadedAt).getTime()
                )
                .filter(
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
      ) : (searchStarted && filteredFiles && filteredFiles.length === 0) ||
        files?.length === 0 ? (
        <div className="flex flex-col gap-8 w-full items-center mt-24">
          <Image
            alt="an image of a picture and directory icon"
            width="300"
            height="300"
            src="/empty.svg"
          />
          <div className="text-2xl text-center">You have no files, upload one now</div>
        </div>
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
            {filteredFiles.map(
              ({ name, fileUrl, uploadedAt, uploadedBy }, i) => (
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
                        buttonVariants({ variant: "link" }),
                        "w-fit"
                      )}
                    >
                      Download
                    </a>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      ) : searchStarted ? ( // Check if search has started and no files match the search
        <div className="flex flex-col gap-8 w-full items-center mt-24">
          <Image
            alt="an image of a picture and directory icon"
            width="300"
            height="300"
            src="/empty.svg"
          />
          <div className="text-2xl text-center">You have no files, upload one now</div>
        </div>
      ) : (
        <LoadingState />
      )}
    </div>
  );
};

export default FileTable;

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
