"use client";

import { useState } from "react";
import { Category } from "@/config/api";
import { categoriesService } from "@/services/categories";
import { 
  X, 
  Plus, 
  Trash2, 
  Tags, 
  Loader2, 
  LayoutList,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface CategoryModalProps {
  onClose: () => void;
  categories: Array<Category>;
  onCategoryCreated: () => void;
  onCategoryDeleted: () => void;
  onRefresh: () => void;
}

export default function CategoryModal({
  onClose,
  categories,
  onCategoryCreated,
  onCategoryDeleted,
  onRefresh,
}: CategoryModalProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      setIsLoading(true);
      await categoriesService.createCategory({ name: newCategoryName } as Category);
      setNewCategoryName("");
      onCategoryCreated();
      toast.success("تم إضافة الفئة بنجاح");
    } catch (error) {
      console.error("Failed to create category:", error);
      toast.error("فشل في إضافة الفئة");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الفئة؟ سيتم حذف جميع البرامج المرتبطة بها.")) {
      try {
        setIsDeleting(categoryId);
        await categoriesService.deleteCategory(categoryId);
        onCategoryDeleted();
        toast.success("تم حذف الفئة بنجاح");
      } catch (error) {
        console.error("Failed to delete category:", error);
        toast.error("فشل في حذف الفئة");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
              <Tags className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">إدارة الفئات التعليمية</h3>
              <p className="text-emerald-100 text-sm">أضف أو احذف تصنيفات البرامج التعليمية</p>
            </div>
          </div>
          <button onClick={onClose} className="h-10 w-10 rounded-xl bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Add New Category Form */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4 text-emerald-600" />
              إضافة فئة جديدة
            </h4>
            <form onSubmit={handleAddCategory} className="flex gap-3">
              <div className="flex-1">
                <Input 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                  placeholder="اسم الفئة الجديدة..."
                  className="h-12 rounded-xl border-gray-200 bg-white"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading || !newCategoryName.trim()}
                className="h-12 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
              </Button>
            </form>
          </div>

          {/* Existing Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <LayoutList className="h-4 w-4 text-gray-500" />
              الفئات المتاحة ({categories.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-emerald-200 hover:shadow-md transition-all"
                >
                  <div>
                    <p className="font-bold text-gray-900">{category.name}</p>
                    <p className="text-xs text-gray-500">{category.courses?.length || 0} برنامج</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={isDeleting === category.id}
                    className="h-9 w-9 p-0 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    {isDeleting === category.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
            
            {categories.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <AlertCircle className="h-8 w-8 mb-2 opacity-20" />
                <p>لا توجد فئات حالياً</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <Button 
              onClick={onClose}
              variant="outline"
              className="h-12 px-10 rounded-xl border-gray-200 text-gray-600 font-bold"
            >
              إغلاق النافذة
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
