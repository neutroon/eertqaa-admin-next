"use client";

import { useEffect, useState } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import CourseModal from "./CourseModal";
import CategoryModal from "./CategoryModal";
import { Course, Category } from "@/config/api";
import { categoriesService } from "@/services/categories";
import { coursesService } from "@/services/courses";

interface CourseManagementProps {
  courses: Course[];
  onCourseCreated: (course: Course) => void;
  onCourseUpdated: (course: Course) => void;
  onCourseDeleted: (courseId: string) => void;
  onRefresh: () => void;
}

export default function CourseManagement({
  courses,
  onCourseCreated,
  onCourseUpdated,
  onCourseDeleted,
  onRefresh,
}: CourseManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await categoriesService.getAllCategories();
      setCategories(response);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const refreshCategories = () => {
    loadCategories();
  };
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || course.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowCourseModal(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا البرنامج؟")) {
      try {
        await coursesService.deleteCourse(courseId);
        onCourseDeleted(courseId);
        // Refresh categories to update course counts
        refreshCategories();
        // Also refresh courses to ensure consistency
        onRefresh();
      } catch (error) {
        console.error("Failed to delete course:", error);
        alert("فشل في حذف البرنامج. يرجى المحاولة مرة أخرى.");
      }
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
            <Cog6ToothIcon className="w-4 h-4 ml-2" />
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
              {/* <div
                className={`w-4 h-4 rounded-full ${category.color} ml-3`}
              ></div> */}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {category.name}
                </p>
                <p className="text-xs text-gray-500">
                  {category.courses?.length || 0} برنامج
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
                  المدة (شهر)
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الوصف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المقاعد المتاحة
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
                      {/* <div className="text-sm text-gray-500">
                        التقييم: {course.rating} ⭐
                      </div> */}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {course.category?.name || "غير محدد"}
                    </span>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.instructor}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.availableSeats}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        course.availableSeats == 0 && "bg-red-100 text-red-800"
                      }${
                        course.availableSeats > 0 &&
                        "bg-purple-100 text-green-800"
                      }${
                        course.status === "inactive" &&
                        "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {course.availableSeats === 0
                        ? "مكتمل"
                        : course.availableSeats > 0
                        ? "متاح"
                        : "غير متاح"}
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
                    {/* <button className="text-gray-600 hover:text-gray-900">
                      <EyeIcon className="w-4 h-4" />
                    </button> */}
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
          onCourseCreated={(newCourse) => {
            onCourseCreated(newCourse);
            // Refresh categories to update course counts
            refreshCategories();
          }}
          onCourseUpdated={(updatedCourse) => {
            onCourseUpdated(updatedCourse);
            // Refresh categories in case category was changed
            refreshCategories();
          }}
          onRefresh={onRefresh}
        />
      )}

      {showCategoryModal && (
        <CategoryModal
          onClose={() => setShowCategoryModal(false)}
          categories={categories}
          onCategoryCreated={refreshCategories}
          onCategoryDeleted={refreshCategories}
          onRefresh={refreshCategories}
        />
      )}
    </div>
  );
}
