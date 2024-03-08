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
import { Plus } from "lucide-react";
import { MultiDocumentDropzoneUsage } from "./MultiDocumentDropzoneUsage";

type Props = {
  classroomId: string;
  subjectId: string;
  userName: string;
};

export default function DocumentUploadDialog({
  subjectId,
  classroomId,
  userName,
}: Props) {
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
      <DialogContent className="md:max-w-[425px] max-w-[350px]">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Drag your files or click to select files
          </DialogDescription>
        </DialogHeader>
        <MultiDocumentDropzoneUsage
          classroomId={classroomId}
          subjectId={subjectId}
          userName={userName}
        />
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
