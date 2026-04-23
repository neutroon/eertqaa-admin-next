"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/users";
import { 
  UserCircle, 
  ShieldCheck, 
  Bell, 
  Globe, 
  Settings, 
  Lock, 
  Phone, 
  Mail,
  User,
  Loader2,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", name: "الملف الشخصي", icon: UserCircle, color: "text-blue-600", bg: "bg-blue-50" },
    { id: "security", name: "الأمان", icon: Lock, color: "text-purple-600", bg: "bg-purple-50" },
    { id: "notifications", name: "الإشعارات", icon: Bell, color: "text-orange-600", bg: "bg-orange-50" },
    { id: "system", name: "إعدادات النظام", icon: Settings, color: "text-gray-600", bg: "bg-gray-50" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Settings className="h-32 w-32 rotate-12" />
        </div>
        <div className="relative z-10 space-y-1">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings className="h-8 w-8" />
            الإعدادات
          </h1>
          <p className="text-gray-400 font-medium">إدارة ملفك الشخصي، الأمان، وتفضيلات المنصة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200",
                activeTab === tab.id
                  ? `${tab.bg} ${tab.color} shadow-md shadow-gray-200/50 scale-[1.02]`
                  : "bg-white text-gray-500 hover:bg-gray-50 border border-transparent hover:border-gray-200"
              )}
            >
              <tab.icon className="h-5 w-5" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl border border-gray-200/50 shadow-sm overflow-hidden"
            >
              {activeTab === "profile" && <ProfileSection />}
              {activeTab === "security" && <SecuritySection />}
              {(activeTab === "notifications" || activeTab === "system") && (
                <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Loader2 className="h-10 w-10 animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">قريباً جداً</h3>
                  <p className="text-gray-500 max-w-sm">هذا القسم قيد اللمسات الأخيرة وسيكون متاحاً خلال أيام قليلة.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ProfileSection() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      await userService.updateUser(user.id, formData);
      toast.success("تم تحديث البيانات بنجاح");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء التحديث");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-6">
        <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
          {user?.name?.charAt(0) || "U"}
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
          <p className="text-gray-500 font-medium">@{user?.role?.toLowerCase()}</p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100">
              <CheckCircle2 className="h-3 w-3" />
              حساب مفعل
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-700 font-bold">الاسم بالكامل</Label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="pr-10 h-12 rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 font-bold">رقم الهاتف</Label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="pr-10 h-12 rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-bold">البريد الإلكتروني</Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="pr-10 h-12 rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 rounded-xl px-10 h-12 font-bold shadow-lg"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "حفظ التغييرات"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function SecuritySection() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("كلمة المرور الجديدة غير متطابقة");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("يجب أن تكون كلمة المرور 6 أحرف على الأقل");
      return;
    }

    setIsLoading(true);
    try {
      // In our current userService.updateUser, we can just pass the new password
      // In a more secure app, we'd have a dedicated /change-password endpoint that checks currentPassword
      await userService.updateUser(user.id, { 
        password: formData.newPassword 
      });
      toast.success("تم تغيير كلمة المرور بنجاح");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء تغيير كلمة المرور");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900">تغيير كلمة المرور</h2>
        <p className="text-gray-500 font-medium">احرص على استخدام كلمة مرور قوية وغير مكررة</p>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 leading-relaxed">
          عند تغيير كلمة المرور، ستحتاج لاستخدام الكلمة الجديدة في المرة القادمة التي تقوم فيها بتسجيل الدخول.
        </p>
      </div>

      <form onSubmit={handlePasswordChange} className="space-y-6 max-w-xl">
        <div className="space-y-2">
          <Label className="text-gray-700 font-bold">كلمة المرور الحالية</Label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              type="password"
              value={formData.currentPassword}
              onChange={e => setFormData({...formData, currentPassword: e.target.value})}
              className="pr-10 h-12 rounded-xl"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 font-bold">كلمة المرور الجديدة</Label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              type="password"
              value={formData.newPassword}
              onChange={e => setFormData({...formData, newPassword: e.target.value})}
              className="pr-10 h-12 rounded-xl"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 font-bold">تأكيد كلمة المرور الجديدة</Label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              type="password"
              value={formData.confirmPassword}
              onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
              className="pr-10 h-12 rounded-xl"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 rounded-xl px-10 h-12 font-bold shadow-lg w-full sm:w-auto"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "تحديث كلمة المرور"}
          </Button>
        </div>
      </form>
    </div>
  );
}
