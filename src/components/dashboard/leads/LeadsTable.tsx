"use client";

import { Lead } from "@/config/api";
import { formatPhoneNumber } from "@/utils/validation";
import {
    PencilIcon,
    TrashIcon,
    ChatBubbleLeftRightIcon,
    EyeIcon,
    LockClosedIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StatusSelect from "./StatusSelect";
import CopyButton from "@/components/ui/CopyButton";
import SourceBadge from "./SourceBadge";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useLeads } from "@/hooks/useLeads";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";


interface LeadsTableProps {
    leads: Lead[];
    onEdit: (lead: Lead) => void;
    onDelete: (leadId: string) => void;
    onStatusChange: (leadId: string, newStatus: string) => void;
    onClaimLead: (leadId: string) => void;
    isDeleting: string | null;
    isUpdatingStatus: string | null;
    isClaiming: string | null;
    getStatusBadgeColor: (status: string) => string;
    getStatusText: (status: string) => string;
}








export default function LeadsTable({
    leads,
    onEdit,
    onDelete,
    onStatusChange,
    onClaimLead,
    isDeleting,
    isUpdatingStatus,
    isClaiming,
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
    // get user id from auth context
    const { user } = useAuth();
    const { leadProfile } = useLeads();
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
        // Reset to page 1 if any filter other than page changes
        if (!updates.page) {
            params.set("page", "1");
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });

        return {
            params,
            pathname,
            router,
        };
    };
    const openLeadProfile = (leadId: string) => {
        updateFilters({ leadId: leadId });
    };
    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100"
                        >
                            العملاء
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100"
                        >
                            التواصل
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100"
                        >
                            البرامج
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100"
                        >
                            حالة الطلب
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100"
                        >
                            تاريخ التسجيل
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100"
                        >
                            الخيارات
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {leads.map((lead, index) => (
                        <tr key={lead.id || `lead-row-${index}`} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-900">
                                                {lead.name}
                                            </span>
                                            <SourceBadge source={lead.source} />
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
                                <div className="flex flex-col items-start gap-2">
                                    <span className="text-sm font-semibold text-gray-500 flex items-center gap-2" dir="ltr">
                                        {
                                            user?.role === UserRole.ADMIN &&
                                            (
                                                <>
                                                    {formatPhoneNumber(lead.phone)}
                                                    < CopyButton value={lead.phone} />
                                                </>
                                            )
                                        }
                                    </span>

                                    {user?.role === UserRole.SALES_AGENT && (

                                        !lead.isLocked && (
                                            <button
                                                onClick={() => onClaimLead(lead.id)}
                                                disabled={isClaiming === lead.id}
                                                className="relative px-3 py-1.5 rounded-sm bg-blue-600 text-white text-sm font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isClaiming === lead.id ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <LoadingSpinner size="sm" />
                                                        <span>جاري الاستلام...</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="absolute -top-2 -right-4 px-2 py-0.5 rounded-full bg-red-500 text-white text-[8px] font-bold uppercase shadow-lg">
                                                            <span className="flex items-center gap-1">
                                                                <span className="w-1 h-1 bg-white rounded-full animate-pulse"></span>
                                                                متاح الآن
                                                            </span>
                                                        </div>
                                                        <span>استلام العميل</span>
                                                    </>
                                                )}
                                            </button>
                                        ))
                                    }
                                    {user?.role === UserRole.SALES_AGENT && (
                                        lead.isLocked && lead.assignedToSales?.user?.id === user?.id && (
                                            <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold uppercase tracking-wide">
                                                <span className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                                                    العميل معك
                                                </span>
                                            </span>
                                        ))
                                    }
                                    {user?.role === UserRole.SALES_AGENT && (
                                        lead.isLocked && lead.assignedToSales?.user?.id !== user?.id && (
                                            <span className="px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-wide">
                                                <span className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                                    مع {lead.assignedToSales?.user?.name}
                                                </span>
                                            </span>
                                        ))
                                    }

                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {lead.selectedProgram?.name}
                                </span>
                                <div className="text-xs text-gray-500 mt-1">
                                    {lead.learningPreference}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="relative group">
                                    {user?.role === UserRole.ADMIN ? (
                                        <StatusSelect
                                            status={lead.status}
                                            onChange={(newStatus) => onStatusChange(lead.id, newStatus)}
                                            isLoading={isUpdatingStatus === lead.id}
                                        />
                                    ) : (
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-sm ${getStatusBadgeColor(lead.status)}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current me-1.5 animate-pulse" />
                                            {getStatusText(lead.status)}
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(lead.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center gap-2 justify-end">
                                    {user?.role === UserRole.ADMIN && (
                                        <>
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
                                        </>
                                    )}

                                    {user?.role === UserRole.SALES_AGENT && (
                                        <div className="flex items-center gap-2">
                                            {lead.assignedToSales?.user?.id === user?.id ? (
                                                <button
                                                    onClick={() => openLeadProfile(lead.id)}
                                                    className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded-full transition-colors"
                                                    title="عرض الملف"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <div className="p-1 text-gray-300" title="غير مخصص لك">
                                                    <LockClosedIcon className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                    )}


                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
