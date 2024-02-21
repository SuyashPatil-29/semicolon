import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MultiFileDropzoneUsage } from "./MultiFileDropzoneUsage"

import {User} from "@prisma/client"
import { Pick } from "@prisma/client/runtime/library"

type Props = {
  user : Pick<User, "name" | "id" | "usn" | "access">
}

export default function FileUploadDialog({user}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-[175px]" variant="default">Upload</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Drag your files or click to select files
          </DialogDescription>
        </DialogHeader>
        <MultiFileDropzoneUsage user={user}/>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

