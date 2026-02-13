import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-3">
      <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
      <p className="text-sm text-gray-400">読み込み中...</p>
    </div>
  );
}
