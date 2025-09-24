"use client";

import { useState, useEffect } from "react";
import { XMarkIcon, StarIcon } from "@heroicons/react/24/outline";

interface TestimonialModalProps {
  testimonial?: {
    id: string;
    studentName: string;
    courseName: string;
    rating: number;
    comment: string;
    status: string;
    isFeatured: boolean;
  } | null;
  onClose: () => void;
  courses: string[];
}

export default function TestimonialModal({
  testimonial,
  onClose,
  courses,
}: TestimonialModalProps) {
  const [formData, setFormData] = useState({
    studentName: "",
    courseName: "",
    rating: 5,
    comment: "",
    status: "pending",
    isFeatured: false,
  });

  useEffect(() => {
    if (testimonial) {
      setFormData({
        studentName: testimonial.studentName || "",
        courseName: testimonial.courseName || "",
        rating: testimonial.rating || 5,
        comment: testimonial.comment || "",
        status: testimonial.status || "pending",
        isFeatured: testimonial.isFeatured || false,
      });
    }
  }, [testimonial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Testimonial data:", formData);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        onClick={interactive ? () => handleRatingChange(index + 1) : undefined}
        className={`w-6 h-6 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        } ${interactive ? "hover:text-yellow-400 cursor-pointer" : ""}`}
      >
        <StarIcon className="w-full h-full" />
      </button>
    ));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {testimonial ? "تعديل الشهادة" : "إضافة شهادة جديدة"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student and Course Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم المتدرب *
              </label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="اسم المتدرب الكامل"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                البرنامج *
              </label>
              <select
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر البرنامج</option>
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              التقييم *
            </label>
            <div className="flex items-center space-x-1">
              {renderStars(formData.rating, true)}
              <span className="text-sm text-gray-500 mr-2">
                {formData.rating}/5
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              التعليق *
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="اكتب تعليق المتدرب حول البرنامج..."
            />
          </div>

          {/* Status and Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الحالة
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">في الانتظار</option>
                <option value="approved">موافق عليه</option>
                <option value="rejected">مرفوض</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="ml-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">شهادة مميزة</span>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              معاينة الشهادة
            </h4>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center ml-3">
                  <span className="text-blue-600 text-sm font-medium">
                    {formData.studentName.charAt(0) || "أ"}
                  </span>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900">
                    {formData.studentName || "اسم المتدرب"}
                  </h5>
                  <p className="text-xs text-gray-500">
                    {formData.courseName || "اسم البرنامج"}
                  </p>
                </div>
              </div>
              <div className="flex items-center mb-3">
                {renderStars(formData.rating)}
                <span className="text-sm text-gray-500 mr-2">
                  {formData.rating}/5
                </span>
              </div>
              <p className="text-sm text-gray-700">
                {formData.comment || "تعليق المتدرب..."}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {testimonial ? "حفظ التعديلات" : "إضافة الشهادة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
