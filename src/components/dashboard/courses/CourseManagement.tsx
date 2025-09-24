"use client";

import { useState } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import CourseModal from "./CourseModal";
import CategoryModal from "./CategoryModal";

const categories = [
  { id: "1", name: "التكنولوجيا", color: "bg-blue-500", courseCount: 8 },
  { id: "2", name: "الإدارة", color: "bg-green-500", courseCount: 5 },
  { id: "3", name: "التسويق", color: "bg-yellow-500", courseCount: 4 },
  { id: "4", name: "المالية", color: "bg-red-500", courseCount: 3 },
  { id: "5", name: "التصميم", color: "bg-purple-500", courseCount: 3 },
  { id: "6", name: "اللغات", color: "bg-indigo-500", courseCount: 2 },
  { id: "7", name: "الصحة", color: "bg-pink-500", courseCount: 2 },
  { id: "8", name: "العلوم", color: "bg-teal-500", courseCount: 2 },
  { id: "9", name: "الطب", color: "bg-orange-500", courseCount: 1 },
];

const courses = [
  {
    id: "1",
    title: "تطوير الويب المتقدم",
    category: "التكنولوجيا",
    instructor: "د. أحمد محمد",
    duration: 40,
    price: 2500,
    capacity: 30,
    enrolled: 25,
    status: "active",
    rating: 4.8,
    popularity: 95,
  },
  {
    id: "2",
    title: "إدارة المشاريع",
    category: "الإدارة",
    instructor: "د. فاطمة أحمد",
    duration: 35,
    price: 2000,
    capacity: 25,
    enrolled: 20,
    status: "active",
    rating: 4.7,
    popularity: 88,
  },
  {
    id: "3",
    title: "التسويق الرقمي",
    category: "التسويق",
    instructor: "د. محمد علي",
    duration: 30,
    price: 1800,
    capacity: 20,
    enrolled: 18,
    status: "active",
    rating: 4.6,
    popularity: 82,
  },
  {
    id: "4",
    title: "الذكاء الاصطناعي",
    category: "التكنولوجيا",
    instructor: "د. نورا سعد",
    duration: 45,
    price: 3000,
    capacity: 15,
    enrolled: 12,
    status: "active",
    rating: 4.9,
    popularity: 92,
  },
  {
    id: "5",
    title: "البرمجة بلغة Python",
    category: "التكنولوجيا",
    instructor: "د. خالد إبراهيم",
    duration: 32,
    price: 2200,
    capacity: 25,
    enrolled: 22,
    status: "active",
    rating: 4.5,
    popularity: 78,
  },
];

export default function CourseManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<{
    id: string;
    title: string;
    category: string;
    instructor: string;
    duration: number;
    price: number;
    capacity: number;
    status: string;
    requirements?: string;
    learningOutcomes?: string;
  } | null>(null);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEditCourse = (course: {
    id: string;
    title: string;
    category: string;
    instructor: string;
    duration: number;
    price: number;
    capacity: number;
    status: string;
    requirements?: string;
    learningOutcomes?: string;
  }) => {
    setEditingCourse(course);
    setShowCourseModal(true);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا البرنامج؟")) {
      // Handle delete logic here
      console.log("Delete course:", courseId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex space-x-4">
          <button
            onClick={() => setShowCourseModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <PlusIcon className="w-4 h-4 ml-2" />
            إضافة برنامج جديد
          </button>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <PlusIcon className="w-4 h-4 ml-2" />
            إدارة الفئات
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="البحث في البرامج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع الفئات</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Categories Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          الفئات التعليمية
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div
                className={`w-4 h-4 rounded-full ${category.color} ml-3`}
              ></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {category.name}
                </p>
                <p className="text-xs text-gray-500">
                  {category.courseCount} برنامج
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            قائمة البرامج ({filteredCourses.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  البرنامج
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الفئة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المدرب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المدة (ساعة)
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  السعر
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التسجيل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {course.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        التقييم: {course.rating} ⭐
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {course.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.instructor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.price.toLocaleString()} ج.م
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.enrolled}/{course.capacity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        course.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {course.status === "active" ? "نشط" : "غير نشط"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditCourse(course)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showCourseModal && (
        <CourseModal
          course={editingCourse}
          onClose={() => {
            setShowCourseModal(false);
            setEditingCourse(null);
          }}
          categories={categories}
        />
      )}

      {showCategoryModal && (
        <CategoryModal
          onClose={() => setShowCategoryModal(false)}
          categories={categories}
        />
      )}
    </div>
  );
}
