"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Course,
  Category,
  UpdateCourseRequest,
  CreateCourseRequest,
} from "@/config/api";
import { coursesService } from "@/services/courses";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";

interface CourseModalProps {
  course?: Course | null;
  onClose: () => void;
  categories: Array<Category>;
  onCourseCreated: (course: Course) => void;
  onCourseUpdated: (course: Course) => void;
  onRefresh: () => void;
}

export default function CourseModal({
  course,
  onClose,
  categories,
  onCourseCreated,
  onCourseUpdated,
  onRefresh,
}: CourseModalProps) {
  const [formData, setFormData] = useState<Course | any>({
    // id: "",
    title: "",
    description: "",
    categoryId: "",
    price: 0,
    imageUrl: "",
    summary: "",
    duration: 0,
    availableSeats: 0,
    createdAt: "",
    updatedAt: "",
    features: [] as string[],
    // selectedFeatures: [] as string[], // Array to store selected feature names
  }) as any;
  const [newFeature, setNewFeature] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (course) {
      // Editing existing course
      setFormData({
        title: course.title || "",
        description: course.description || "",
        duration: course.duration || 0,
        price: course.price || 0,
        availableSeats: course.availableSeats || 0,
        imageUrl: course.imageUrl || "",
        categoryId: course.categoryId || "",
        summary: course.summary || "",
        features: course.features?.map((f) => f.name) || [],
      });
    } else {
      // Creating new course - reset form
      setFormData({
        title: "",
        description: "",
        summary: "",
        duration: 0,
        categoryId: "",
        availableSeats: 0,
        price: 0,
        imageUrl: "",
        features: [],
      });
    }
  }, [course]);

  const updateCourse = async (courseData: UpdateCourseRequest) => {
    try {
      setIsLoading(true);
      const updatedCourse = await coursesService.updateCourse(
        course?.id || "",
        courseData
      );
      onCourseUpdated(updatedCourse);
      toast.success("تم تحديث البرنامج بنجاح");
      onClose();
    } catch (error: any) {
      console.error("Update course error:", error);
      toast.error("فشل في تحديث البرنامج");
    } finally {
      setIsLoading(false);
    }
  };

  const createCourse = async (courseData: CreateCourseRequest) => {
    try {
      setIsLoading(true);
      const newCourse = await coursesService.createCourse(courseData);
      onCourseCreated(newCourse);
      toast.success("تم إضافة البرنامج بنجاح");
      onClose();
    } catch (error: any) {
      console.error("Create course error:", error);
      toast.error("فشل في إضافة البرنامج");
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (course) {
      await updateCourse(formData);
    } else {
      await createCourse(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]:
        name === "duration" || name === "availableSeats" || name === "price"
          ? Number(value)
          : value,
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData((prev: any) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFormData((prev: any) => ({
      ...prev,
      features: prev.features.filter(
        (feature: string) => feature !== featureToRemove
      ),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  // Available features options
  // const availableFeatures = [
  //   "دعم فني",
  //   "مرونة في التعلم",
  //   "شهادة معتمدة",
  //   "مواد تعليمية شاملة",
  //   "تطبيقات عملية",
  //   "متابعة فردية",
  // ];

  // const handleFeatureToggle = (featureName: string) => {
  //   setFormData((prev: any) => {
  //     const currentFeatures = prev.features || [];
  //     const isSelected = currentFeatures.includes(featureName);

  //     return {
  //       ...prev,
  //       features: isSelected
  //         ? currentFeatures.filter((f: string) => f !== featureName)
  //         : [...currentFeatures, featureName],
  //     };
  //   });
  // };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {course ? "تعديل البرنامج" : "إضافة برنامج جديد"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                عنوان البرنامج *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الفئة *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر الفئة</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المدة (شهر) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                السعر (ج.م) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المقاعد المتاحة *
              </label>
              <input
                type="number"
                name="availableSeats"
                value={formData.availableSeats}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                السعر (ج.م) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div> */}

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رابط الصورة
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div> */}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              وصف البرنامج *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              placeholder="اكتب وصفاً مفصلاً للبرنامج"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ملخص المحتوي
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={2}
              placeholder="اكتب ملخص محتويات البرنامج"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مميزات البرنامج
            </label>

            {/* Add new feature input */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="أضف ميزة جديدة"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addFeature}
                disabled={!newFeature.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                إضافة
              </button>
            </div>

            {/* Display selected features */}
            {formData.features?.length > 0 && (
              <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                <p className="text-sm text-gray-600 mb-2">الميزات المحددة:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="mr-1 inline-flex items-center justify-center w-4 h-4 text-blue-400 hover:bg-blue-200 hover:text-blue-600 rounded-full"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
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
              {isLoading ? (
                <div className="flex items-center">
                  <LoadingSpinner size="sm" />
                  <span className="mr-2">جاري التحميل...</span>
                </div>
              ) : course ? (
                "حفظ التعديلات"
              ) : (
                "إضافة البرنامج"
              )}
              {/* {course ? "حفظ التعديلات" : "إضافة البرنامج"} */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
