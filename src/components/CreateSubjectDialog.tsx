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
} from "@/components/ui/form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";
import { CreateSubjectRequest } from "@/lib/validators/CreateSubjectValidator";
import { Plus } from "lucide-react";

const formSchema = z.object({
  classroomName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

type Props = {
  classroomId: string;
}

export default function CreateSubjectDialog({ classroomId }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classroomName: "",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload : CreateSubjectRequest = {
        classroomId,
        subjectName: values.classroomName,
      };
      const { data } = await axios.post("/api/subject", payload);
      if (data) {
        toast({
          title: "Subject created",
          description: `You have successfully created ${data.name}.`,
        });
        router.push(`/classrooms/${classroomId}/${data.id}`); // Redirect to the newly created classroom
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to create subject`,
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
        <Button className="md:font-semibold text-sm md:block hidden" variant="default" size="sm">
          Create Subject
        </Button>
        <Button className="font-semibold text-sm md:hidden block" variant="default" size="sm">
          <Plus className="font-black"/>
        </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="md:max-w-[425px] max-w-[350px]">
        <DialogHeader>
          <DialogTitle>Create a new subject</DialogTitle>
          <DialogDescription>
            Fill in the information below to create a new subject.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="classroomName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Java" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be your subject name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                isLoading={form.formState.isSubmitting}
                formAction="submit"
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
