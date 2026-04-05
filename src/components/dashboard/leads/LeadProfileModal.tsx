"use client";

import { useState, useEffect } from "react";
import {
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  UserIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Lead, LeadFeedback, AddLeadFeedbackRequest } from "@/config/api";
import { leadsService } from "@/services/leads";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { cn } from "@/lib/utils";
import StatusSelect from "./StatusSelect";
import CopyButton from "@/components/ui/CopyButton";

interface LeadProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string | null;
  lead: Lead | null;
  isLoading: boolean;
  onLeadUpdated: () => void;
  onClaimLead?: (leadId: string) => void;
  isClaiming?: boolean;
}

export default function LeadProfileModal({
  isOpen,
  onClose,
  leadId,
  lead,
  isLoading,
  onLeadUpdated,
  onClaimLead,
  isClaiming,
}: LeadProfileModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"details" | "feedback">("details");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    callOutcome: "answered",
    notes: "",
    nextFollowUpDate: "",
  });

  const canEdit =
    user?.role === UserRole.SALES_AGENT &&
    lead?.assignedToSales?.user?.id === user?.id;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusOptions = [
    { value: "pending", label: "في الانتظار" },
    { value: "contacted", label: "تم التواصل" },
    { value: "converted", label: "تم الحجز" },
    { value: "rejected", label: "غير مهتم" },
  ];

  const outcomeOptions = [
    { value: "answered", label: "تم الرد" },
    { value: "no-answer", label: "لم يرد" },
    { value: "busy", label: "مشغول" },
    { value: "wrong-number", label: "رقم خاطئ" },
    { value: "interested", label: "مهتم" },
    { value: "not-interested", label: "غير مهتم" },
  ];

  const handleStatusChange = async (newStatus: string) => {
    if (!lead) return;
    try {
      setIsUpdatingStatus(true);
      await leadsService.updateLeadStatus(lead.id, newStatus as any);
      onLeadUpdated();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("فشل في تحديث الحالة");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || !user) return;

    try {
      setIsSubmittingFeedback(true);
      const feedbackData: AddLeadFeedbackRequest = {
        leadId: lead.id,
        csAgentId: user.id,
        callOutcome: feedbackForm.callOutcome,
        notes: feedbackForm.notes,
        nextFollowUpDate: feedbackForm.nextFollowUpDate || undefined,
      };

      await leadsService.addLeadFeedback(feedbackData);
      setFeedbackForm({
        callOutcome: "answered",
        notes: "",
        nextFollowUpDate: "",
      });
      onLeadUpdated();
    } catch (error) {
      console.error("Failed to add feedback:", error);
      alert("فشل في إضافة الملاحظة");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4">
      <div
        className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl max-h-screen sm:max-h-[90vh] overflow-hidden text-right bg-gray-50 shadow-2xl sm:rounded-2xl z-10 flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
            {/* <div> */}
            <h3 className="text-xl font-bold text-gray-900 leading-none">
              {isLoading ? "جاري التحميل..." : lead?.name}
            </h3>
            {/* <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                {isLoading ? "..." : (
                                    <>
                                        <span>سجل العميل:</span>
                                        <span dir="ltr">{lead?.phone}</span>
                                        {lead?.phone && <CopyButton value={lead.phone} className="h-6 w-6" />}
                                    </>
                                )}
                            </p> */}
            {/* </div> */}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row min-h-[500px]">
          {/* Sidebar Stats & Status */}
          <div className="w-full md:w-80 bg-white border-b md:border-b-0 md:border-l border-gray-200 p-6 space-y-6 overflow-y-auto">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                حالة العميل
              </label>
              <StatusSelect
                status={lead?.status || "pending"}
                onChange={handleStatusChange}
                isLoading={isUpdatingStatus}
                disabled={!canEdit}
              />
            </div>

            <div className="pt-6 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                معلومات المبيعات
              </label>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-900 font-medium">
                      {lead?.assignedToSales?.user?.name || "غير محدد"}
                    </p>
                    <p className="text-xs text-gray-500">موظف المبيعات</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-900 font-medium">
                      {formatDate(lead?.assignedAt as any)}
                    </p>
                    <p className="text-xs text-gray-500">تاريخ الاستلام</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                آخر تواصل
              </label>
              <p className="text-sm text-gray-900 font-medium">
                {formatDate(lead?.lastContactedAt)}
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 flex px-2 sm:px-6 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab("details")}
                className={cn(
                  "px-4 sm:px-6 py-4 text-sm font-black border-b-2 transition-all whitespace-nowrap",
                  activeTab === "details"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-400 hover:text-gray-700",
                )}
              >
                تفاصيل العميل
              </button>
              <button
                onClick={() => setActiveTab("feedback")}
                className={cn(
                  "px-4 sm:px-6 py-4 text-sm font-black border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
                  activeTab === "feedback"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-400 hover:text-gray-700",
                )}
              >
                سجل المتابعة
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold",
                    activeTab === "feedback"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-500",
                  )}
                >
                  {lead?.feedbacks?.length || 0}
                </span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[600px]">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <LoadingSpinner size="lg" />
                </div>
              ) : activeTab === "details" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Basic Info */}
                  <div className="space-y-6">
                    <section>
                      <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-blue-600" />
                        المتطلبات التدريبية
                      </h4>
                      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                        <div>
                          <p className="text-xs text-gray-500">
                            البرنامج المختار
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            {lead?.selectedProgram?.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">تفضيل التعلم</p>
                          <p className="text-sm font-bold text-gray-900">
                            {lead?.learningPreference}
                          </p>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4 text-blue-600" />
                        معلومات التواصل
                      </h4>
                      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs text-gray-500">رقم الهاتف</p>
                            <p
                              className="text-sm font-bold text-gray-900"
                              dir="ltr"
                            >
                              {lead?.phone}
                            </p>
                          </div>
                          {lead?.phone && <CopyButton value={lead.phone} />}
                        </div>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <ChatBubbleLeftIcon className="w-4 h-4 text-blue-600" />
                        رسالة العميل
                      </h4>
                      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-sm text-gray-700 leading-relaxed italic">
                        "{lead?.message}"
                      </div>
                      {lead?.voiceMessage && (
                        <div className="mt-4">
                          <p className="text-xs text-gray-500 mb-2">
                            الرسالة الصوتية
                          </p>
                          <audio
                            src={lead.voiceMessage}
                            controls
                            className="w-full h-8"
                          />
                        </div>
                      )}
                    </section>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-6">
                    <section>
                      <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-blue-600" />
                        بيانات النظام
                      </h4>
                      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            كود الدولة
                          </span>
                          <span className="text-sm font-bold px-2 py-0.5 bg-gray-100 rounded">
                            EG
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            تاريخ التسجيل
                          </span>
                          <span className="text-sm font-medium">
                            {formatDate(lead?.createdAt)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            تاريخ التحديث
                          </span>
                          <span className="text-sm font-medium">
                            {formatDate(lead?.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Feedback Form */}
                  {canEdit && (
                    <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm mb-8">
                      <h4 className="text-sm font-bold text-gray-900 mb-4">
                        إضافة متابعة جديدة
                      </h4>
                      <form onSubmit={handleAddFeedback} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              نتجية التواصل
                            </label>
                            <select
                              value={feedbackForm.callOutcome}
                              onChange={(e) =>
                                setFeedbackForm({
                                  ...feedbackForm,
                                  callOutcome: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {outcomeOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              موعد المتابعة القادم
                            </label>
                            <input
                              type="datetime-local"
                              value={feedbackForm.nextFollowUpDate}
                              onChange={(e) =>
                                setFeedbackForm({
                                  ...feedbackForm,
                                  nextFollowUpDate: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            ملاحظات التواصل
                          </label>
                          <textarea
                            value={feedbackForm.notes}
                            onChange={(e) =>
                              setFeedbackForm({
                                ...feedbackForm,
                                notes: e.target.value,
                              })
                            }
                            placeholder="اكتب تفاصيل المكالمة أو المتابعة هنا..."
                            rows={3}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={isSubmittingFeedback}
                            className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                          >
                            {isSubmittingFeedback ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              "حفظ الملاحظة"
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Feedback Timeline */}
                  <div className="relative">
                    <div className="absolute top-0 end-4 h-full w-px bg-gray-200" />
                    <div className="space-y-8 pe-12">
                      {lead?.feedbacks?.length === 0 ? (
                        <div className="text-center py-12">
                          <ChatBubbleLeftIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                          <p className="text-gray-400 font-medium">
                            لا توجد سجلات متابعة حتى الآن
                          </p>
                        </div>
                      ) : (
                        lead?.feedbacks?.map((f, i) => (
                          <div key={f.id || i} className="relative">
                            <div className="absolute top-0 -end-12 w-8 h-8 rounded-full bg-blue-50 border-2 border-white shadow-sm flex items-center justify-center">
                              <span className="text-[10px] font-bold text-blue-600">
                                #{lead.feedbacks.length - i}
                              </span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={cn(
                                      "px-2 py-0.5 rounded text-[10px] font-bold",
                                      f.callOutcome === "answered"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700",
                                    )}
                                  >
                                    {outcomeOptions.find(
                                      (o) => o.value === f.callOutcome,
                                    )?.label || f.callOutcome}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {formatDate(f.createdAt)}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500 font-medium">
                                  {f.csAgent?.user?.name}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {f.notes}
                              </p>
                              {f.nextFollowUpDate && (
                                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2 text-[10px] text-orange-600 font-bold">
                                  <ArrowPathIcon className="w-3 h-3" />
                                  المتابعة القادمة:{" "}
                                  {formatDate(f.nextFollowUpDate)}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
