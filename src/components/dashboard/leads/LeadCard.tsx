"use client";

import { useState, useEffect, useRef } from "react";
import {
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  SpeakerWaveIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Lead } from "@/config/api";
import { formatPhoneNumber } from "@/utils/validation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ClipboardIcon } from "lucide-react";

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  onStatusChange: (leadId: string, newStatus: string) => void;
  isDeleting: boolean;
  isUpdatingStatus: boolean;
  getStatusBadgeColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

export default function LeadCard({
  lead,
  onEdit,
  onDelete,
  onStatusChange,
  isDeleting,
  isUpdatingStatus,
  getStatusBadgeColor,
  getStatusText,
}: LeadCardProps) {
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

  const statusOptions = [
    {
      value: "pending",
      label: "في الانتظار",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "contacted",
      label: "تم التواصل",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "converted",
      label: "تم التحويل",
      color: "bg-green-100 text-green-800",
    },
    { value: "rejected", label: "مرفوض", color: "bg-red-100 text-red-800" },
  ];

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(lead.id, newStatus);
    setShowStatusDropdown(false);
  };

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

            {/* Status Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                disabled={isUpdatingStatus}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${getStatusBadgeColor(
                  lead.status
                )} ${
                  isUpdatingStatus
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {isUpdatingStatus ? (
                  <LoadingSpinner size="sm" className="ml-1" />
                ) : (
                  <ChevronDownIcon className="w-3 h-3 ml-1" />
                )}
                {getStatusText(lead.status)}
              </button>

              {showStatusDropdown && !isUpdatingStatus && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleStatusChange(option.value)}
                        className={`w-full text-right px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          option.value === lead.status
                            ? "bg-gray-50 font-medium"
                            : ""
                        }`}
                      >
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${option.color}`}
                        >
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row gap-4 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <PhoneIcon className="w-4 h-4 ml-1 flex-shrink-0" />
              <span className="font-mono" dir="ltr">
                {formatPhoneNumber(lead.phone)}
              </span>
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
                {lead.selectedProgram}
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
            {lead.message.length > 100 && (
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
        <div className="flex items-center gap-2 flex-col">
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => onEdit(lead)}
              className="inline-flex items-center p-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              title="تعديل"
            >
              <PencilIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDelete(lead.id)}
              disabled={isDeleting}
              className="inline-flex items-center p-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              title="حذف"
            >
              {isDeleting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <TrashIcon className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-2" dir="ltr">
            {/* add copy option here */}
            <button
              onClick={() => navigator.clipboard.writeText(lead.id)}
              className="inline-flex items-center p-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              title="نسخ"
            >
              <ClipboardIcon className="w-4 h-4" />
            </button>
            <p className="text-sm text-gray-500">{lead.id.slice(0, 8)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
