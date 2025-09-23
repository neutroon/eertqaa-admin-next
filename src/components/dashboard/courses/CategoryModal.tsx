"use client";

import { useState } from "react";
import { XMarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

interface CategoryModalProps {
  onClose: () => void;
  categories: any[];
}

const colorOptions = [
  { name: "أزرق", value: "bg-blue-500" },
  { name: "أخضر", value: "bg-green-500" },
  { name: "أصفر", value: "bg-yellow-500" },
  { name: "أحمر", value: "bg-red-500" },
  { name: "بنفسجي", value: "bg-purple-500" },
  { name: "نيلي", value: "bg-indigo-500" },
  { name: "وردي", value: "bg-pink-500" },
  { name: "تركوازي", value: "bg-teal-500" },
  { name: "برتقالي", value: "bg-orange-500" },
];

export default function CategoryModal({
  onClose,
  categories,
}: CategoryModalProps) {
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color: "bg-blue-500",
  });

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.name.trim()) {
      // Handle adding new category here
      console.log("New category:", newCategory);
      setNewCategory({ name: "", description: "", color: "bg-blue-500" });
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الفئة؟")) {
      // Handle delete logic here
      console.log("Delete category:", categoryId);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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
                placeholder="مثال: التكنولوجيا"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اللون
              </label>
              <select
                value={newCategory.color}
                onChange={(e) =>
                  setNewCategory((prev) => ({ ...prev, color: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {colorOptions.map((color) => (
                  <option key={color.value} value={color.value}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              وصف الفئة
            </label>
            <textarea
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="وصف مختصر للفئة التعليمية"
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <PlusIcon className="w-4 h-4 ml-2" />
              إضافة الفئة
            </button>
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
                  <div
                    className={`w-4 h-4 rounded-full ${category.color} ml-3`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {category.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {category.courseCount} كورس
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <TrashIcon className="w-4 h-4" />
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
