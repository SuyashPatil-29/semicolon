"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "./ui/use-toast";
import { Trash } from "lucide-react";

type Props = {
  classroomId: string;
};

export default function DeleteClassroomDialog({ classroomId }: Props) {

  const onSubmit = async () => {
    try {
    const { data } = await axios.delete(`/api/classroom/${classroomId}`);
    if(data){
      toast({
        title: "Deleted",
        description: "Classroom deleted successfully",
      })
    }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete classroom",
        variant: "destructive",
      }) 
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost"><Trash className="h-4 w-4"/></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete this classroom?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <Button type="button" onClick={onSubmit} variant="default">
          Delete
        </Button>
      </DialogContent>
    </Dialog>
  );
}

