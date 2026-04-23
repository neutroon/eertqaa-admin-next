"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { userService, User } from "@/services/users";
import { UserForm } from "@/components/dashboard/users/UserForm";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserCog, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getUser(id as string);
        if (data) {
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast.error("حدث خطأ أثناء تحميل بيانات المستخدم");
        router.push("/dashboard/users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      // If password is empty, remove it from data to prevent changing it
      const updateData = { ...data };
      if (!updateData.password) {
        delete updateData.password;
      }

      await userService.updateUser(id as string, updateData);
      toast.success("تم تحديث بيانات المستخدم بنجاح");
      router.push("/dashboard/users");
    } catch (error: any) {
      console.error("Failed to update user:", error);
      toast.error(error.message || "حدث خطأ أثناء تحديث البيانات");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium">جاري تحميل بيانات المستخدم...</p>
      </div>
    );
  }

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
              <UserCog className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">تعديل بيانات المستخدم</h1>
              <p className="text-blue-100 mt-1">يمكنك تعديل بيانات {user?.name} وتغيير صلاحياته أو كلمة المرور</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {user && (
            <UserForm 
              initialData={user} 
              onSubmit={handleSubmit} 
              isLoading={isSaving} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
