"use client";

import { useState } from "react";
import { User } from "@/services/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ShieldCheck, 
  Headset, 
  Mail, 
  Phone, 
  User as UserIcon, 
  Lock,
  ArrowRight,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { UserRole } from "@/config/api";

interface UserFormProps {
  initialData?: Partial<User>;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export function UserForm({ initialData, onSubmit, isLoading }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    password: "",
    role: initialData?.role || UserRole.SALES_AGENT,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-700 font-semibold">الاسم بالكامل</Label>
          <div className="relative">
            <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              id="name"
              placeholder="مثال: محمد أحمد"
              className="pr-10 h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-700 font-semibold">رقم الهاتف</Label>
          <div className="relative">
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              id="phone"
              placeholder="01xxxxxxxxx"
              className="pr-10 h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-semibold">البريد الإلكتروني</Label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              id="email"
              type="email"
              placeholder="example@eertqaa.com"
              className="pr-10 h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700 font-semibold">
            {initialData ? "كلمة المرور (اتركها فارغة إذا لم ترد التغيير)" : "كلمة المرور"}
          </Label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              id="password"
              type="password"
              placeholder="••••••••"
              className="pr-10 h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!initialData}
            />
          </div>
        </div>
      </div>

      {/* Role Selection */}
      <div className="space-y-3 pt-2">
        <Label className="text-gray-700 font-semibold">دور المستخدم</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            onClick={() => setFormData({ ...formData, role: UserRole.SALES_AGENT })}
            className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
              formData.role === UserRole.SALES_AGENT 
                ? "border-blue-600 bg-blue-50/50 shadow-md" 
                : "border-gray-100 hover:border-gray-200 bg-white"
            }`}
          >
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
              formData.role === UserRole.SALES_AGENT ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
            }`}>
              <Headset className="h-6 w-6" />
            </div>
            <div>
              <p className={`font-bold ${formData.role === UserRole.SALES_AGENT ? "text-blue-700" : "text-gray-900"}`}>
                وكيل مبيعات
              </p>
              <p className="text-xs text-gray-500">لديه صلاحية الوصول للعملاء وإدارة المحادثات</p>
            </div>
          </div>

          <div 
            onClick={() => setFormData({ ...formData, role: UserRole.ADMIN })}
            className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
              formData.role === UserRole.ADMIN 
                ? "border-purple-600 bg-purple-50/50 shadow-md" 
                : "border-gray-100 hover:border-gray-200 bg-white"
            }`}
          >
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
              formData.role === UserRole.ADMIN ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-500"
            }`}>
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className={`font-bold ${formData.role === UserRole.ADMIN ? "text-purple-700" : "text-gray-900"}`}>
                مدير (Admin)
              </p>
              <p className="text-xs text-gray-500">لديه صلاحية كاملة لإدارة النظام والمستخدمين والتقارير</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-end">
        <Button 
          type="submit" 
          className={`h-12 px-10 rounded-xl font-bold transition-all shadow-lg ${
            formData.role === UserRole.ADMIN ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin ml-2" />
              جاري الحفظ...
            </>
          ) : (
            initialData ? "تحديث البيانات" : "إنشاء المستخدم"
          )}
        </Button>
      </div>
    </form>
  );
}
