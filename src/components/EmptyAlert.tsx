import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type Props = {
  message: string;
};

export function EmptyAlert({ message }: Props) {
  return (
    <Alert className="dark:bg-[rgb(40,40,40)] dark:border-white">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Oops</AlertTitle>
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>
  );
}
