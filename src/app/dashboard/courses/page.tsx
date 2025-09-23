import CourseManagement from "@/components/dashboard/courses/CourseManagement";

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">إدارة الكورسات</h1>
        <p className="text-gray-600 mt-2">
          إدارة جميع الكورسات والفئات التعليمية
        </p>
      </div>

      <CourseManagement />
    </div>
  );
}
