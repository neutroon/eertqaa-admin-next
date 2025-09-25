"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Lead, CreateLeadRequest, UpdateLeadRequest } from "@/config/api";
import { leadsService } from "@/services/leads";
import {
  validateCreateLead,
  validateUpdateLead,
  getFieldError,
  ValidationError,
  ValidationResult,
} from "@/utils/validation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onLeadCreated: (lead: Lead) => void;
  onLeadUpdated: (lead: Lead) => void;
}

export default function LeadModal({
  isOpen,
  onClose,
  lead,
  onLeadCreated,
  onLeadUpdated,
}: LeadModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    selectedProgram: "",
    learningPreference: "",
    message: "",
    voiceMessage: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const isEditing = !!lead;

  useEffect(() => {
    if (isOpen) {
      if (lead) {
        // Editing existing lead
        setFormData({
          name: lead.name || "",
          phone: lead.phone || "",
          selectedProgram: lead.selectedProgram || "",
          learningPreference: lead.learningPreference || "",
          message: lead.message || "",
          voiceMessage: lead.voiceMessage || "",
        });
      } else {
        // Creating new lead
        setFormData({
          name: "",
          phone: "",
          selectedProgram: "",
          learningPreference: "",
          message: "",
          voiceMessage: "",
        });
      }
      setErrors([]);
    }
  }, [isOpen, lead]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific errors when user starts typing
    if (errors.length > 0) {
      setErrors((prev) => prev.filter((error) => error.field !== name));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const validation = isEditing
      ? validateUpdateLead({
          name: formData.name,
          selectedProgram: formData.selectedProgram,
          learningPreference: formData.learningPreference,
          message: formData.message,
        })
      : validateCreateLead(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      if (isEditing && lead) {
        // Update existing lead
        const updateData: UpdateLeadRequest = {
          name: formData.name,
          selectedProgram: formData.selectedProgram,
          learningPreference: formData.learningPreference,
          message: formData.message,
        };

        const updatedLead = await leadsService.updateLead(lead.id, updateData);
        onLeadUpdated(updatedLead);
      } else {
        // Create new lead
        const createData: CreateLeadRequest = {
          name: formData.name,
          phone: formData.phone,
          selectedProgram: formData.selectedProgram,
          learningPreference: formData.learningPreference,
          message: formData.message,
          voiceMessage: formData.voiceMessage,
        };

        const newLead = await leadsService.createLead(createData);
        onLeadCreated(newLead);
      }

      onClose();
    } catch (error: any) {
      console.error("Failed to save lead:", error);
      setErrors([
        {
          field: "general",
          message: error.message || "حدث خطأ أثناء حفظ البيانات",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const programOptions = [
    "البرمجة الأساسية",
    "تطوير الويب",
    "تطوير التطبيقات",
    "علوم البيانات",
    "الذكاء الاصطناعي",
    "الأمن السيبراني",
    "التسويق الرقمي",
    "التجارة الإلكترونية",
  ];

  const learningPreferenceOptions = [
    "أونلاين مباشر",
    "أونلاين مسجل",
    "حضوري",
    "مختلط (أونلاين + حضوري)",
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div className="relative inline-block w-full max-w-2xl my-8 overflow-hidden text-right align-middle transition-all transform bg-white shadow-xl rounded-lg z-10">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? "تعديل العميل المحتمل" : "إضافة عميل محتمل جديد"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
            {/* General Error */}
            {getFieldError(errors, "general") && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">
                  {getFieldError(errors, "general")}
                </p>
              </div>
            )}

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                الاسم *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  getFieldError(errors, "name")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="أدخل اسم العميل"
              />
              {getFieldError(errors, "name") && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError(errors, "name")}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                رقم الهاتف
                {isEditing && (
                  <span className="text-xs text-gray-500 mr-2">
                    (للعرض فقط)
                  </span>
                )}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isEditing}
                className={`block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isEditing
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : getFieldError(errors, "phone")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="01012345678"
                dir="ltr"
              />
              {getFieldError(errors, "phone") && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError(errors, "phone")}
                </p>
              )}
              {!isEditing && (
                <p className="mt-1 text-xs text-gray-500">
                  مثال: 01012345678 أو +201012345678
                </p>
              )}
            </div>

            {/* Selected Program */}
            <div>
              <label
                htmlFor="selectedProgram"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                البرنامج المختار *
              </label>
              <select
                id="selectedProgram"
                name="selectedProgram"
                value={formData.selectedProgram}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  getFieldError(errors, "selectedProgram")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
              >
                <option value="">اختر البرنامج</option>
                {programOptions.map((program) => (
                  <option key={program} value={program}>
                    {program}
                  </option>
                ))}
              </select>
              {getFieldError(errors, "selectedProgram") && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError(errors, "selectedProgram")}
                </p>
              )}
            </div>

            {/* Learning Preference */}
            <div>
              <label
                htmlFor="learningPreference"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                تفضيل التعلم *
              </label>
              <select
                id="learningPreference"
                name="learningPreference"
                value={formData.learningPreference}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  getFieldError(errors, "learningPreference")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
              >
                <option value="">اختر تفضيل التعلم</option>
                {learningPreferenceOptions.map((preference) => (
                  <option key={preference} value={preference}>
                    {preference}
                  </option>
                ))}
              </select>
              {getFieldError(errors, "learningPreference") && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError(errors, "learningPreference")}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                الرسالة *
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  getFieldError(errors, "message")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="أدخل رسالة العميل..."
              />
              {getFieldError(errors, "message") && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError(errors, "message")}
                </p>
              )}
            </div>

            {/* Voice Message */}
            <div>
              <label
                htmlFor="voiceMessage"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                الرسالة الصوتية
              </label>
              {/* <textarea
                id="voiceMessage"
                name="voiceMessage"
                rows={3}
                value={formData.voiceMessage}
                onChange={handleInputChange}
                disabled={isEditing}
                className={`block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isEditing
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : getFieldError(errors, "voiceMessage")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="نص الرسالة الصوتية أو رابط الملف الصوتي..."
              /> */}
              <audio src={formData.voiceMessage} controls className="w-full" />
              {getFieldError(errors, "voiceMessage") && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError(errors, "voiceMessage")}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" />
                    <span className="mr-2">جاري الحفظ...</span>
                  </div>
                ) : isEditing ? (
                  "تحديث"
                ) : (
                  "إضافة"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
