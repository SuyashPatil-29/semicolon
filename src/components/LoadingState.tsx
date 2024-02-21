import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-[50vh]">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
  );
}
