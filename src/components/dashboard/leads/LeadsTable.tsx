"use client";

import { Lead } from "@/config/api";
import { formatPhoneNumber } from "@/utils/validation";
import {
    PencilIcon,
    TrashIcon,
    ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StatusSelect from "./StatusSelect";

interface LeadsTableProps {
    leads: Lead[];
    onEdit: (lead: Lead) => void;
    onDelete: (leadId: string) => void;
    onStatusChange: (leadId: string, newStatus: string) => void;
    isDeleting: string | null;
    isUpdatingStatus: string | null;
    getStatusBadgeColor: (status: string) => string;
    getStatusText: (status: string) => string;
}

export default function LeadsTable({
    leads,
    onEdit,
    onDelete,
    onStatusChange,
    isDeleting,
    isUpdatingStatus,
    getStatusBadgeColor,
    getStatusText,
}: LeadsTableProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("ar", {
            year: "numeric",
            month: "short",
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

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            العميل
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            معلومات الاتصال
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            البرنامج
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            الحالة
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            التاريخ
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            إجراءات
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {lead.name}
                                        </div>
                                        {lead.message && (
                                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate max-w-[200px]">
                                                <ChatBubbleLeftRightIcon className="w-3 h-3" />
                                                {lead.message.substring(0, 30)}...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900" dir="ltr">
                                    {formatPhoneNumber(lead.phone)}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {lead.selectedProgram}
                                </span>
                                <div className="text-xs text-gray-500 mt-1">
                                    {lead.learningPreference}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="relative group">
                                    <StatusSelect
                                        status={lead.status}
                                        onChange={(newStatus) => onStatusChange(lead.id, newStatus)}
                                        isLoading={isUpdatingStatus === lead.id}
                                    />
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(lead.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center gap-2 justify-end">
                                    <button
                                        onClick={() => onEdit(lead)}
                                        className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded-full transition-colors"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(lead.id)}
                                        disabled={isDeleting === lead.id}
                                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                                    >
                                        {isDeleting === lead.id ? (
                                            <LoadingSpinner size="sm" />
                                        ) : (
                                            <TrashIcon className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    );
}
