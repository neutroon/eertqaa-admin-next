"use client";

import { useState, useEffect, useRef } from "react";
import {
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  SpeakerWaveIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  LockClosedIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import StatusSelect from "./StatusSelect";
import { Lead } from "@/config/api";
import { formatPhoneNumber } from "@/utils/validation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CopyButton from "@/components/ui/CopyButton";

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  onStatusChange: (leadId: string, newStatus: string) => void;
  onClaimLead: (leadId: string) => void;
  isDeleting: boolean;
  isUpdatingStatus: boolean;
  isClaiming: boolean;
  getStatusBadgeColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

export default function LeadCard({
  lead,
  onEdit,
  onDelete,
  onStatusChange,
  onClaimLead,
  isDeleting,
  isUpdatingStatus,
  isClaiming,
  getStatusBadgeColor,
  getStatusText,
}: LeadCardProps) {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const updateFilters = (
    updates: Record<string, string | number | undefined>
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const openLeadProfile = (leadId: string) => {
    updateFilters({ leadId: leadId });
  };
  const [isExpanded, setIsExpanded] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // const statusOptions = [
  //   {
  //     value: "pending",
  //     label: "في الانتظار",
  //     color: "bg-yellow-100 text-yellow-800",
  //   },
  //   {
  //     value: "contacted",
  //     label: "تم التواصل",
  //     color: "bg-blue-100 text-blue-800",
  //   },
  //   {
  //     value: "converted",
  //     label: "تم التحويل",
  //     color: "bg-green-100 text-green-800",
  //   },
  //   { value: "rejected", label: "مرفوض", color: "bg-red-100 text-red-800" },
  // ];

  // const handleStatusChange = (newStatus: string) => {
  //   onStatusChange(lead.id, newStatus);
  //   setShowStatusDropdown(false);
  // };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowStatusDropdown(false);
      }
    };

    if (showStatusDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStatusDropdown]);

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <h4 className="text-lg font-medium text-gray-900 truncate">
              {lead.name}
            </h4>
          </div>

          {/* Status Display */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            {user?.role === UserRole.ADMIN ? (
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">الحالة</span>
                <StatusSelect
                  status={lead.status}
                  onChange={(newStatus) => onStatusChange(lead.id, newStatus)}
                  isLoading={isUpdatingStatus}
                  disabled={isUpdatingStatus}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">الحالة</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold shadow-sm ${getStatusBadgeColor(lead.status)}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current me-2 animate-pulse" />
                  {getStatusText(lead.status)}
                </span>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row gap-4 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <PhoneIcon className="w-4 h-4 ml-1 flex-shrink-0" />
              <p className="font-mono text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-2" dir="ltr">
                {user?.role === UserRole.ADMIN && (formatPhoneNumber(lead.phone))}
                <CopyButton value={lead.phone} />
              </p>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CalendarIcon className="w-4 h-4 ml-1 flex-shrink-0" />
              <span>{formatDate(lead.createdAt)}</span>
            </div>
          </div>

          {/* Program and Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            <div>
              <span className="text-xs font-medium text-gray-500">
                البرنامج:
              </span>
              <p className="text-sm text-gray-900 mt-1">
                {lead.selectedProgram?.name}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500">
                تفضيل التعلم:
              </span>
              <p className="text-sm text-gray-900 mt-1">
                {lead.learningPreference}
              </p>
            </div>
          </div>

          {/* Message Preview */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-500">
                الرسالة:
              </span>
            </div>
            <p className="text-sm text-gray-700 line-clamp-2">{lead.message}</p>
            {lead.message?.length > 100 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-blue-600 hover:text-blue-500 mt-1"
              >
                {isExpanded ? "إخفاء" : "عرض المزيد"}
              </button>
            )}
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="space-y-3 pt-3 border-t border-gray-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">
                    الرسالة الكاملة:
                  </span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {lead.message}
                </p>
              </div>
            </div>
          )}

          {lead.adminNote && (
            <div>
              <span className="text-xs font-medium text-gray-500">
                ملاحظة الإدارة:
              </span>
              <p className="text-sm text-gray-700 mt-1 bg-blue-50 p-2 rounded">
                {lead.adminNote}
              </p>
            </div>
          )}

          {lead.voiceMessage && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <SpeakerWaveIcon className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-500">
                  الرسالة الصوتية:
                </span>
              </div>
              <div className="rounded-lg p-3">
                <audio src={lead.voiceMessage} controls className="w-full" />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-end gap-2 flex-col">
          <div className="flex items-end flex-col gap-2">
            <button
              onClick={() => onEdit(lead)}
              className="inline-flex items-end p-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              title="تعديل"
            >
              <PencilIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDelete(lead.id)}
              disabled={isDeleting}
              className="inline-flex items-end p-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              title="حذف"
            >
              {isDeleting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <TrashIcon className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="flex flex-col items-end gap-2">
            {user?.role === UserRole.SALES_AGENT && (
              !lead.isLocked ? (
                <button
                  onClick={() => onClaimLead(lead.id)}
                  disabled={isClaiming}
                  className="w-full relative px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold shadow-md hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isClaiming ? (
                    <div className="flex items-center justify-center gap-2">
                      <LoadingSpinner size="sm" />
                      <span>جاري الاستلام...</span>
                    </div>
                  ) : (
                    <span>استلام العميل</span>
                  )}
                </button>
              ) : lead.assignedToSales?.user?.id === user?.id ? (
                <button
                  onClick={() => openLeadProfile(lead.id)}
                  className="inline-flex items-center p-2 border border-indigo-300 rounded-lg text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50"
                  title="عرض الملف"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
              ) : (
                <div className="p-2 text-gray-300" title="غير مخصص لك">
                  <LockClosedIcon className="w-4 h-4" />
                </div>
              )
            )}
            <CopyButton
              value={lead.id}
              className="border border-gray-300 rounded-lg w-9 h-9 flex items-center justify-center p-0"
            />
            <p className="text-sm text-gray-500">{lead.id.slice(0, 8)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
