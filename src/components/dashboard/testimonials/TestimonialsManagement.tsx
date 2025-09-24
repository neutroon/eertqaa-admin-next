"use client";

import { useState } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import TestimonialModal from "./TestimonialModal";

const testimonials = [
  {
    id: "1",
    studentName: "أحمد محمد علي",
    courseName: "تطوير الويب المتقدم",
    rating: 5,
    comment:
      "برنامج ممتاز جداً، تعلمت الكثير من التقنيات الحديثة. المدرب كان محترف جداً وشرح كل شيء بوضوح.",
    status: "approved",
    createdAt: new Date("2024-01-15"),
    isFeatured: true,
  },
  {
    id: "2",
    studentName: "فاطمة أحمد حسن",
    courseName: "إدارة المشاريع",
    rating: 4,
    comment:
      "محتوى البرنامج مفيد جداً، ساعدني في تطوير مهاراتي الإدارية. أنصح به بشدة.",
    status: "approved",
    createdAt: new Date("2024-01-14"),
    isFeatured: false,
  },
  {
    id: "3",
    studentName: "محمد عبدالله",
    courseName: "التسويق الرقمي",
    rating: 5,
    comment:
      "أفضل برنامج في التسويق الرقمي، تعلمت استراتيجيات فعالة وساعدني في تطوير مشروعي.",
    status: "pending",
    createdAt: new Date("2024-01-13"),
    isFeatured: false,
  },
  {
    id: "4",
    studentName: "نورا سعد الدين",
    courseName: "الذكاء الاصطناعي",
    rating: 5,
    comment:
      "برنامج متقدم ومفصل، تعلمت مفاهيم الذكاء الاصطناعي بشكل عملي. شكراً للمدرب الرائع.",
    status: "approved",
    createdAt: new Date("2024-01-12"),
    isFeatured: true,
  },
  {
    id: "5",
    studentName: "خالد إبراهيم",
    courseName: "البرمجة بلغة Python",
    rating: 3,
    comment: "البرنامج جيد لكن يحتاج لبعض التحسينات في المحتوى.",
    status: "rejected",
    createdAt: new Date("2024-01-11"),
    isFeatured: false,
  },
  {
    id: "6",
    studentName: "سارة أحمد",
    courseName: "التصميم الجرافيكي",
    rating: 4,
    comment: "محتوى ممتاز وتطبيقات عملية، ساعدني في تطوير مهاراتي في التصميم.",
    status: "pending",
    createdAt: new Date("2024-01-10"),
    isFeatured: false,
  },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusLabels = {
  pending: "في الانتظار",
  approved: "موافق عليه",
  rejected: "مرفوض",
};

const courses = [
  "تطوير الويب المتقدم",
  "إدارة المشاريع",
  "التسويق الرقمي",
  "الذكاء الاصطناعي",
  "البرمجة بلغة Python",
  "التصميم الجرافيكي",
  "التحليل المالي",
  "اللغة الإنجليزية",
];

export default function TestimonialsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<{
    id: string;
    studentName: string;
    courseName: string;
    rating: number;
    comment: string;
    status: string;
    createdAt: Date;
    isFeatured: boolean;
  } | null>(null);

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch =
      testimonial.studentName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      testimonial.courseName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      testimonial.comment.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || testimonial.status === statusFilter;
    const matchesCourse =
      courseFilter === "all" || testimonial.courseName === courseFilter;
    const matchesRating =
      ratingFilter === "all" || testimonial.rating.toString() === ratingFilter;

    return matchesSearch && matchesStatus && matchesCourse && matchesRating;
  });

  const handleEditTestimonial = (testimonial: {
    id: string;
    studentName: string;
    courseName: string;
    rating: number;
    comment: string;
    status: string;
    createdAt: Date;
    isFeatured: boolean;
  }) => {
    setEditingTestimonial(testimonial);
    setShowTestimonialModal(true);
  };

  const handleStatusChange = (testimonialId: string, newStatus: string) => {
    // Handle status change logic here
    console.log("Change status:", testimonialId, newStatus);
  };

  const handleToggleFeatured = (testimonialId: string) => {
    // Handle toggle featured logic here
    console.log("Toggle featured:", testimonialId);
  };

  const handleDeleteTestimonial = (testimonialId: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الشهادة؟")) {
      // Handle delete logic here
      console.log("Delete testimonial:", testimonialId);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة التعليقات</h2>
          <p className="text-gray-600">إدارة تعليقات المتدربين وآرائهم</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowTestimonialModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <PlusIcon className="w-4 h-4 ml-2" />
            إضافة تعليق جديد
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="البحث في الشهادات..."
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
              <option value="rejected">مرفوض</option>
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
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
            </div>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع التقييمات</option>
              <option value="5">5 نجوم</option>
              <option value="4">4 نجوم</option>
              <option value="3">3 نجوم</option>
              <option value="2">2 نجوم</option>
              <option value="1">1 نجمة</option>
            </select>
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">
                      {testimonial.studentName.split(" ")[0].charAt(0)}
                    </span>
                  </div>
                  <div className="mr-3">
                    <h4 className="text-sm font-medium text-gray-900">
                      {testimonial.studentName}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {testimonial.courseName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {testimonial.isFeatured && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                      مميز
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      statusColors[
                        testimonial.status as keyof typeof statusColors
                      ]
                    }`}
                  >
                    {
                      statusLabels[
                        testimonial.status as keyof typeof statusLabels
                      ]
                    }
                  </span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  {renderStars(testimonial.rating)}
                </div>
                <span className="text-sm text-gray-500 mr-2">
                  {testimonial.rating}/5
                </span>
              </div>

              {/* Comment */}
              <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                {testimonial.comment}
              </p>

              {/* Date */}
              <p className="text-xs text-gray-500 mb-4">
                {format(testimonial.createdAt, "dd MMM yyyy")}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditTestimonial(testimonial)}
                    className="text-blue-600 hover:text-blue-800"
                    title="تعديل"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(testimonial.id, "approved")
                    }
                    className="text-green-600 hover:text-green-800"
                    title="موافقة"
                  >
                    <CheckIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(testimonial.id, "rejected")
                    }
                    className="text-red-600 hover:text-red-800"
                    title="رفض"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(testimonial.id)}
                    className={`${
                      testimonial.isFeatured
                        ? "text-yellow-600"
                        : "text-gray-400"
                    } hover:text-yellow-600`}
                    title={testimonial.isFeatured ? "إلغاء التمييز" : "تمييز"}
                  >
                    <StarIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDeleteTestimonial(testimonial.id)}
                    className="text-red-600 hover:text-red-800"
                    title="حذف"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                  <button
                    className="text-gray-600 hover:text-gray-800"
                    title="عرض"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTestimonials.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <StarIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            لا توجد شهادات
          </h3>
          <p className="text-gray-500 mb-4">
            لم يتم العثور على شهادات تطابق المعايير المحددة
          </p>
          <button
            onClick={() => setShowTestimonialModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="w-4 h-4 ml-2" />
            إضافة شهادة جديدة
          </button>
        </div>
      )}

      {/* Modals */}
      {showTestimonialModal && (
        <TestimonialModal
          testimonial={editingTestimonial}
          onClose={() => {
            setShowTestimonialModal(false);
            setEditingTestimonial(null);
          }}
          courses={courses}
        />
      )}
    </div>
  );
}
