"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "./ui/use-toast";
import { LogOut } from "lucide-react";

type Props = {
  classroomId: string;
};

export default function LeaveClassroomDialog({ classroomId }: Props) {
  const onSubmit = async () => {
    try {
      const { data } = await axios.delete(`/api/user/${classroomId}`);
      if (data) {
        toast({
          title: "Left",
          description: "Classroom left successfully",
        });
        window.location.reload();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to leave classroom",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <LogOut className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to leave this classroom?
          </DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogClose asChild>
          <Button type="button" onClick={onSubmit} variant="default">
            Leave
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
