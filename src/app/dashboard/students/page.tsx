import StudentManagement from "@/components/dashboard/students/StudentManagement";

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">إدارة المتدربين</h1>
        <p className="text-gray-600 mt-2">إدارة تسجيلات المتدربين ومعلوماتهم</p>
      </div>

      <StudentManagement />
    </div>
  );
}
