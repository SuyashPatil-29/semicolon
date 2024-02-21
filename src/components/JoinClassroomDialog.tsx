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
import { ClassroomWithDetails } from "./UserData";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";

type Props = {
  classroom: ClassroomWithDetails;
  userId : string
};

export default function JoinClassroomDialog({ classroom, userId }: Props) {
  const router = useRouter();

  const onSubmit = async () => {
    const payload = {
      classroomId: classroom.id,
      userId,
    };
    try {
    const { data } = await axios.put(`/api/classroom/${classroom.id}`, payload);
    if(data){
      router.push(`/classrooms/${classroom.id}`);
    }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join classroom",
        variant: "destructive",
      }) 
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Join</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to join {classroom.name}?
          </DialogTitle>
          <DialogDescription>
            You can join only one classroom. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <Button type="button" onClick={onSubmit} variant="default">
          Join
        </Button>
      </DialogContent>
    </Dialog>
  );
}
