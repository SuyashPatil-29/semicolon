"use client";
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
import { ClassroomWithDetails } from "./UserData";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  classroom: ClassroomWithDetails;
  userId: string;
};

const formSchema = z.object({
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 numbers.",
    })
    .max(6, { message: "Password must be at most 6 numbers." }),
});

export default function JoinClassroomDialog({ classroom, userId }: Props) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const payload = {
      classroomId: classroom.id,
      userId,
      password: values.password,
    };
    try {
      const { data } = await axios.put(
        `/api/classroom/${classroom.id}`,
        payload
      );
      if (data) {
        router.push(`/classrooms/${classroom.id}`);
        toast({
          title: "Joined",
          description: "Classroom joined successfully",
        })
      }
    } catch (error:any) {
      toast({
        title: "Error",
        description:error.response.data.error,
        variant: "destructive",
      });
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="123456" {...field} />
                  </FormControl>
                  <FormDescription>
                    You must enter the classroom password to join.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
