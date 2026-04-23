"use client";

import { useState, useEffect } from "react";
import { 
  Course, 
  Category, 
  UpdateCourseRequest, 
  CreateCourseRequest 
} from "@/config/api";
import { coursesService } from "@/services/courses";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  BookOpen, 
  Calendar, 
  Users, 
  Tag, 
  FileText, 
  CheckCircle,
  Plus,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface CourseModalProps {
  course?: Course | null;
  onClose: () => void;
  categories: Array<Category>;
  onCourseCreated: (course: Course) => void;
  onCourseUpdated: (course: Course) => void;
  onRefresh: () => void;
}

export default function CourseModal({
  course,
  onClose,
  categories,
  onCourseCreated,
  onCourseUpdated,
  onRefresh,
}: CourseModalProps) {
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    categoryId: "",
    price: 0,
    imageUrl: "",
    summary: "",
    duration: 0,
    availableSeats: 0,
    features: [] as string[],
    status: "active"
  });
  const [newFeature, setNewFeature] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        description: course.description || "",
        duration: course.duration || 0,
        price: course.price || 0,
        availableSeats: course.availableSeats || 0,
        imageUrl: course.imageUrl || "",
        categoryId: course.categoryId || "",
        summary: course.summary || "",
        features: course.features?.map((f) => f.name) || [],
        status: course.status || "active"
      });
    }
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (course) {
        const updated = await coursesService.updateCourse(course.id, formData);
        onCourseUpdated(updated);
        toast.success("تم تحديث البرنامج بنجاح");
      } else {
        const created = await coursesService.createCourse(formData);
        onCourseCreated(created);
        toast.success("تم إضافة البرنامج بنجاح");
      }
    } catch (error: any) {
      console.error("Course action error:", error);
      toast.error(error.message || "حدث خطأ أثناء حفظ البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData((prev: any) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{course ? "تعديل البرنامج" : "إضافة برنامج جديد"}</h3>
              <p className="text-indigo-100 text-sm">قم بإدخال تفاصيل البرنامج التعليمي والمميزات</p>
            </div>
          </div>
          <button onClick={onClose} className="h-10 w-10 rounded-xl bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">عنوان البرنامج</Label>
              <Input 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
                className="h-12 rounded-xl border-gray-200"
                placeholder="مثال: دبلومة إدارة الأعمال"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">الفئة التعليمية</Label>
              <select 
                value={formData.categoryId}
                onChange={e => setFormData({...formData, categoryId: e.target.value})}
                required
                className="w-full h-12 rounded-xl border border-gray-200 px-3 bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
              >
                <option value="">اختر الفئة...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">المدة (بالشهور)</Label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  type="number"
                  value={formData.duration}
                  onChange={e => setFormData({...formData, duration: Number(e.target.value)})}
                  required
                  className="pr-10 h-12 rounded-xl border-gray-200"
                />
              </div>
            </div>

            {/* Seats */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">المقاعد المتاحة</Label>
              <div className="relative">
                <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  type="number"
                  value={formData.availableSeats}
                  onChange={e => setFormData({...formData, availableSeats: Number(e.target.value)})}
                  required
                  className="pr-10 h-12 rounded-xl border-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">وصف البرنامج</Label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              required
              rows={3}
              className="w-full rounded-xl border border-gray-200 p-4 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
              placeholder="اكتب وصفاً مفصلاً للبرنامج التدريبي..."
            />
          </div>

          {/* Features */}
          <div className="space-y-3">
            <Label className="text-gray-700 font-semibold">مميزات البرنامج</Label>
            <div className="flex gap-2">
              <Input 
                value={newFeature}
                onChange={e => setNewFeature(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                placeholder="أضف ميزة جديدة (مثال: شهادة معتمدة)"
                className="h-12 rounded-xl border-gray-200"
              />
              <Button 
                type="button" 
                onClick={addFeature}
                className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.features.map((feature: string, i: number) => (
                <Badge 
                  key={i} 
                  className="bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100 px-3 py-1.5 rounded-full flex items-center gap-2"
                >
                  <CheckCircle className="h-3 w-3" />
                  {feature}
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, features: formData.features.filter((_: any, idx: number) => idx !== i)})}
                    className="hover:text-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="h-12 px-8 rounded-xl"
            >
              إلغاء
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="h-12 px-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري الحفظ...
                </div>
              ) : (
                course ? "تحديث البيانات" : "إنشاء البرنامج"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
