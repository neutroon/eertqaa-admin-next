"use client";

import { useState } from "react";
import { XMarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Category } from "@/config/api";
import { categoriesService } from "@/services/categories";
import { LoaderIcon } from "lucide-react";

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
  const [newCategory, setNewCategory] = useState({
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    try {
      setIsLoading(true);
      await categoriesService.createCategory(newCategory as Category);
      setNewCategory({ name: "" });
      onCategoryCreated();
    } catch (error) {
      console.error("Failed to create category:", error);
      alert("فشل في إضافة الفئة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الفئة؟")) {
      try {
        setIsDeleting(categoryId);
        await categoriesService.deleteCategory(categoryId);
        onCategoryDeleted();
      } catch (error) {
        console.error("Failed to delete category:", error);
        alert("فشل في حذف الفئة. يرجى المحاولة مرة أخرى.");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            إدارة الفئات التعليمية
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Add New Category Form */}
        <form
          onSubmit={handleAddCategory}
          className="mb-6 p-4 bg-gray-50 rounded-lg"
        >
          <h4 className="text-md font-medium text-gray-900 mb-3">
            إضافة فئة جديدة
          </h4>
          <div className="flex gap-3">
            <div className="basis-2/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم الفئة *
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="مثال: المجمعة النفسية"
              />
            </div>
            <div className="flex justify-end items-end basis-1/3">
              <button
                type="submit"
                disabled={isLoading}
                className="justify-center inline-flex items-center px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <LoaderIcon className="w-4 h-4 ml-2 animate-spin" />
                    جاري الإضافة...
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-4 h-4 ml-2" />
                    إضافة الفئة
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Existing Categories */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">
            الفئات الموجودة
          </h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {category.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {category.courses.length} برنامج
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  disabled={isDeleting === category.id}
                  className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting === category.id ? (
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                  ) : (
                    <TrashIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
