"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { userService } from "@/services/users";
import { UserForm } from "@/components/dashboard/users/UserForm";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus } from "lucide-react";
import { toast } from "sonner";

export default function NewUserPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await userService.createUser(data);
      toast.success("تم إنشاء المستخدم بنجاح");
      router.push("/dashboard/users");
    } catch (error: any) {
      console.error("Failed to create user:", error);
      toast.error(error.message || "حدث خطأ أثناء إنشاء المستخدم");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="rounded-xl gap-2 hover:bg-gray-100"
          onClick={() => router.back()}
        >
          <ArrowRight className="h-4 w-4" />
          رجوع
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200/50 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-8 text-white">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">إضافة مستخدم جديد</h1>
              <p className="text-blue-100 mt-1">قم بتعبئة البيانات لإنشاء حساب جديد للمدير أو وكيل المبيعات</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <UserForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
