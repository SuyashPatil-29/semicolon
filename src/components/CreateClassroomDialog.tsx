"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";

const formSchema = z.object({
  classroomName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, { message: "Password must be at least 6 numbers." }).max(6, { message: "Password must be at most 6 numbers." }),
});

export default function CreateClassroomDialog() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classroomName: "",
      password: "",
    },
  });

  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data } = await axios.post("/api/classroom", values);
      if (data.id) {
        toast({
          title: "Classroom created",
          description: `You have successfully created ${data.name}.`,
        })
        router.push(`/classrooms/${data.id}`); // Redirect to the newly created classroom
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create classroom",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="font-semibold" variant="default">
          Create Classroom
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new classroom</DialogTitle>
          <DialogDescription>
            Fill in the information below to create a new classroom. You will be
            an admin of this classroom.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="classroomName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Classroom Name</FormLabel>
              <FormControl>
                <Input placeholder="AIML-3C" {...field} />
              </FormControl>
              <FormDescription>
                This is your classroom name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
                This is your classroom password.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      <DialogFooter>
        <Button type="submit" formAction="submit">Create</Button>
      </DialogFooter>
      </form>
    </Form>
      </DialogContent>
    </Dialog>
  );
}
