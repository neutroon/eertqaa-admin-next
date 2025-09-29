"use client";

import { useEffect, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Course } from "@/config/api";
import CourseManagement from "@/components/dashboard/courses/CourseManagement";
import { coursesService } from "@/services/courses";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      const response = await coursesService.getAllCourses();
      setCourses(response.courses);
    } catch (error: any) {
      console.error("Failed to load courses:", error);
      setError("فشل في تحميل البرامج");
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const handleRefresh = () => {
    loadCourses(true);
  };

  const handleCourseCreated = (newCourse: Course) => {
    setCourses((prev) => [newCourse, ...prev]);
  };

  const handleCourseUpdated = (updatedCourse: Course) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
  };

  const handleCourseDeleted = (courseId: string) => {
    setCourses((prev) => prev.filter((course) => course.id !== courseId));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة البرامج</h1>
          <p className="text-gray-600 mt-2">
            إدارة جميع البرامج والفئات التعليمية
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowPathIcon
            className={`w-4 h-4 ml-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "جاري التحديث..." : "تحديث"}
        </button>
      </div>

      <CourseManagement
        courses={courses}
        onCourseCreated={handleCourseCreated}
        onCourseUpdated={handleCourseUpdated}
        onCourseDeleted={handleCourseDeleted}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
