"use client";

import { useState } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import StudentModal from "./StudentModal";
import ExportModal from "./ExportModal";

const students = [
  {
    id: "1",
    firstName: "أحمد",
    lastName: "محمد علي",
    email: "ahmed@example.com",
    phone: "01234567890",
    dateOfBirth: new Date("1995-05-15"),
    gender: "male",
    nationality: "مصري",
    city: "القاهرة",
    selectedCourses: ["تطوير الويب المتقدم", "الذكاء الاصطناعي"],
    learningPreference: "online",
    registrationDate: new Date("2024-01-15"),
    status: "pending",
    notes: "متدرب متفوق",
    emergencyContact: {
      name: "محمد علي",
      phone: "01234567891",
      relationship: "أب",
    },
  },
  {
    id: "2",
    firstName: "فاطمة",
    lastName: "أحمد حسن",
    email: "fatima@example.com",
    phone: "01234567892",
    dateOfBirth: new Date("1998-08-22"),
    gender: "female",
    nationality: "مصري",
    city: "الإسكندرية",
    selectedCourses: ["إدارة المشاريع", "التسويق الرقمي"],
    learningPreference: "offline",
    registrationDate: new Date("2024-01-14"),
    status: "approved",
    notes: "تحتاج متابعة خاصة",
    emergencyContact: {
      name: "أحمد حسن",
      phone: "01234567893",
      relationship: "زوج",
    },
  },
  {
    id: "3",
    firstName: "محمد",
    lastName: "عبدالله",
    email: "mohammed@example.com",
    phone: "01234567894",
    dateOfBirth: new Date("1992-12-10"),
    gender: "male",
    nationality: "سعودي",
    city: "الرياض",
    selectedCourses: ["البرمجة بلغة Python"],
    learningPreference: "hybrid",
    registrationDate: new Date("2024-01-13"),
    status: "enrolled",
    notes: "متدرب مجتهد",
    emergencyContact: {
      name: "عبدالله محمد",
      phone: "01234567895",
      relationship: "أخ",
    },
  },
  {
    id: "4",
    firstName: "نورا",
    lastName: "سعد الدين",
    email: "nora@example.com",
    phone: "01234567896",
    dateOfBirth: new Date("1996-03-18"),
    gender: "female",
    nationality: "مصري",
    city: "الجيزة",
    selectedCourses: ["الذكاء الاصطناعي", "تطوير الويب المتقدم"],
    learningPreference: "online",
    registrationDate: new Date("2024-01-12"),
    status: "completed",
    notes: "أكملت البرنامج بنجاح",
    emergencyContact: {
      name: "سعد الدين",
      phone: "01234567897",
      relationship: "أب",
    },
  },
  {
    id: "5",
    firstName: "خالد",
    lastName: "إبراهيم",
    email: "khalid@example.com",
    phone: "01234567898",
    dateOfBirth: new Date("1994-07-25"),
    gender: "male",
    nationality: "إماراتي",
    city: "دبي",
    selectedCourses: ["إدارة المشاريع"],
    learningPreference: "offline",
    registrationDate: new Date("2024-01-11"),
    status: "cancelled",
    notes: "ألغى التسجيل لأسباب شخصية",
    emergencyContact: {
      name: "إبراهيم خالد",
      phone: "01234567899",
      relationship: "أب",
    },
  },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  enrolled: "bg-green-100 text-green-800",
  completed: "bg-purple-100 text-purple-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels = {
  pending: "في الانتظار",
  approved: "موافق عليه",
  enrolled: "مسجل",
  completed: "مكتمل",
  cancelled: "ملغي",
};

const learningPreferenceLabels = {
  online: "أونلاين",
  offline: "أوفلاين",
  hybrid: "مختلط",
};

export default function StudentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    gender: string;
    nationality: string;
    city: string;
    selectedCourses: string[];
    learningPreference: string;
    registrationDate: Date;
    status: string;
    notes?: string;
    emergencyContact?: { name: string; phone: string; relationship: string };
  } | null>(null);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone.includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" || student.status === statusFilter;
    const matchesCourse =
      courseFilter === "all" ||
      student.selectedCourses.some((course) => course.includes(courseFilter));

    return matchesSearch && matchesStatus && matchesCourse;
  });

  const handleEditStudent = (student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    gender: string;
    nationality: string;
    city: string;
    selectedCourses: string[];
    learningPreference: string;
    registrationDate: Date;
    status: string;
    notes?: string;
    emergencyContact?: { name: string; phone: string; relationship: string };
  }) => {
    setEditingStudent(student);
    setShowStudentModal(true);
  };

  const handleStatusChange = (studentId: string, newStatus: string) => {
    // Handle status change logic here
    console.log("Change status:", studentId, newStatus);
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const getUniqueCourses = () => {
    const courses = new Set();
    students.forEach((student) => {
      student.selectedCourses.forEach((course) => courses.add(course));
    });
    return Array.from(courses);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex space-x-3">
        <button
          onClick={handleExport}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <DocumentArrowDownIcon className="w-4 h-4 ml-2" />
          تصدير البيانات
        </button>
        <button
          onClick={() => setShowStudentModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          إضافة متدرب جديد
        </button>
      </div>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="البحث في المتدربين..."
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">في الانتظار</option>
              <option value="approved">موافق عليه</option>
              <option value="enrolled">مسجل</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
            </div>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع البرامج</option>
              {getUniqueCourses().map((course, index) => (
                <option key={index} value={course as string}>
                  {course as string}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            قائمة المتدربين ({filteredStudents.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المتدرب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  معلومات الاتصال
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  البرامج المختارة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تفضيل التعلم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ التسجيل
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
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-medium">
                            {student.firstName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.gender === "male" ? "ذكر" : "أنثى"} -{" "}
                          {student.nationality}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.email}</div>
                    <div className="text-sm text-gray-500">{student.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {student.selectedCourses.map((course, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-1 mb-1"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {
                      learningPreferenceLabels[
                        student.learningPreference as keyof typeof learningPreferenceLabels
                      ]
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(student.registrationDate, "dd/MM/yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[
                          student.status as keyof typeof statusColors
                        ]
                      }`}
                    >
                      {
                        statusLabels[
                          student.status as keyof typeof statusLabels
                        ]
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditStudent(student)}
                      className="text-blue-600 hover:text-blue-900"
                      title="تعديل"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStatusChange(student.id, "approved")}
                      className="text-green-600 hover:text-green-900"
                      title="موافقة"
                    >
                      <CheckIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(student.id, "cancelled")
                      }
                      className="text-red-600 hover:text-red-900"
                      title="إلغاء"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                    <button
                      className="text-gray-600 hover:text-gray-900"
                      title="عرض"
                    >
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
      {showStudentModal && (
        <StudentModal
          student={editingStudent}
          onClose={() => {
            setShowStudentModal(false);
            setEditingStudent(null);
          }}
        />
      )}

      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          data={filteredStudents}
        />
      )}
    </div>
  );
}
