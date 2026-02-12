import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { MachiSingleForm } from "@/features/register-machi";
import { MachiBulkUpload } from "@/features/register-machi";

export function MachiRegisterPage() {
  return (
    <div>
      <div className="flex items-center gap-4">
        <Link
          href="/register"
          className="inline-flex items-center justify-center rounded-md h-10 w-10 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">街登録</h1>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="single">個別登録</TabsTrigger>
            <TabsTrigger value="bulk">一括登録 (CSV)</TabsTrigger>
          </TabsList>
          <TabsContent value="single" className="mt-6">
            <MachiSingleForm />
          </TabsContent>
          <TabsContent value="bulk" className="mt-6">
            <MachiBulkUpload />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
