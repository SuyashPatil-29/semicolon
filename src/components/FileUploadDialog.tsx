import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MultiFileDropzoneUsage } from "./MultiFileDropzoneUsage";

import { User } from "@prisma/client";
import { Pick } from "@prisma/client/runtime/library";
import { Plus } from "lucide-react";

type Props = {
  user: Pick<User, "name" | "id" | "usn" | "access">;
};

export default function FileUploadDialog({ user }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <Button
            className="md:font-semibold text-sm md:block hidden"
            variant="default"
            size="sm"
          >
            Upload Files
          </Button>
          <Button
            className="font-semibold text-sm md:hidden block"
            variant="default"
            size="sm"
          >
            <Plus className="font-black" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Drag your files or click to select files
          </DialogDescription>
        </DialogHeader>
        <MultiFileDropzoneUsage user={user} />
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
