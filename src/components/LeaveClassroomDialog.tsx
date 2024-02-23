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
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  classroomId: string;
};

export default function LeaveClassroomDialog({ classroomId }: Props) {
  const router = useRouter()

  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const onSubmit = async () => {
    setIsButtonLoading(true);
    try {
      const { data } = await axios.delete(`/api/user/${classroomId}`);
      if (data) {
        setIsButtonLoading(false);
        toast({
          title: "Left",
          description: "Classroom left successfully",
        });
        router.push("/dashboard")
        window.location.reload()
      }
    } catch (error) {
      setIsButtonLoading(false);
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
      <DialogContent  className="md:max-w-[425px] max-w-[350px]">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to leave this classroom?
          </DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <Button
          type="button"
          onClick={onSubmit}
          isLoading={isButtonLoading}
          variant="default"
        >
          Leave
        </Button>
      </DialogContent>
    </Dialog>
  );
}
