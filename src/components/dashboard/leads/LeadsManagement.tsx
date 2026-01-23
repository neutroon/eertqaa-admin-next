"use client";

import { useState, useEffect } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  TableCellsIcon,
  Squares2X2Icon,
  BarsArrowUpIcon,
  BarsArrowDownIcon,
} from "@heroicons/react/24/outline";
import { Lead, LeadsResponse, LeadsStatsResponse } from "@/config/api";
import { leadsService } from "@/services/leads";
import LeadModal from "./LeadModal";
import LeadCard from "./LeadCard";
import LeadsTable from "./LeadsTable";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ModernLeadsSearch from "./ModernLeadsSearch";
import PageSizeSelect from "./PageSizeSelect";
import LeadProfileModal from "./LeadProfileModal";
import { useSearchParams } from "next/navigation";

interface LeadsManagementProps {
  isFetching?: boolean;
  leadsData: LeadsResponse;
  onLeadCreated: (lead: Lead) => void;
  onLeadUpdated: (lead: Lead) => void;
  onLeadDeleted: (leadId: string) => void;
  onRefresh: () => void;
  children: React.ReactNode;
  filters: {
    page: number;
    limit: number;
    status: string | undefined;
    isLocked: string | undefined;
    search: string;
    sortOrder: "asc" | "desc";
    leadId?: string;
  };
  onFilterChange: (
    updates: Record<string, string | number | undefined>
  ) => void;
  stats?: LeadsStatsResponse;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  leadProfile?: Lead | null;
  leadProfileLoading?: boolean;
  refetchLeadProfile?: () => void;
}

export default function LeadsManagement({
  isFetching = false,
  leadsData,
  onLeadCreated,
  onLeadUpdated,
  onLeadDeleted,
  onRefresh,
  filters,
  onFilterChange,
  stats,
  pageSize,
  onPageSizeChange,
  leadProfile,
  leadProfileLoading = false,
  refetchLeadProfile,
  children,
}: LeadsManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const currentLeadId = searchParams.get("leadId");

  useEffect(() => {
    if (currentLeadId) {
      setIsProfileModalOpen(true);
    } else {
      setIsProfileModalOpen(false);
    }
  }, [currentLeadId]);

  const handleCloseProfileModal = () => {
    onFilterChange({ leadId: undefined });
  };

  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  const handleCreateLead = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا العميل المحتمل؟")) {
      return;
    }

    try {
      setIsDeleting(leadId);
      await leadsService.deleteLead(leadId);
      onLeadDeleted(leadId);
    } catch (error) {
      console.error("Failed to delete lead:", error);
      alert("فشل في حذف العميل المحتمل");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingLead(null);
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      setIsUpdatingStatus(leadId);

      const statusValue = newStatus as
        | "pending"
        | "contacted"
        | "converted"
        | "rejected";

      const updatedLead = await leadsService.updateLeadStatus(
        leadId,
        statusValue
      );

      onLeadUpdated(updatedLead);
    } catch (error) {
      console.error("Failed to update lead status:", error);
      alert("فشل في تحديث حالة العميل المحتمل");
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleClaimLead = async (leadId: string) => {
    try {
      setIsClaiming(leadId);
      const updatedLead = await leadsService.claimLead(leadId);
      onLeadUpdated(updatedLead);
    } catch (error) {
      console.error("Failed to claim lead:", error);
      alert("فشل في استلام العميل");
    } finally {
      setIsClaiming(null);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "contacted":
        return "bg-blue-100 text-blue-800";
      case "converted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "في الانتظار";
      case "contacted":
        return "تم التواصل";
      case "converted":
        return "تم الحجز";
      case "rejected":
        return "غير مهتم";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Modern Search & Filters */}
      <ModernLeadsSearch
        search={filters.search}
        status={filters.status}
        isLocked={filters.isLocked}
        totalResults={leadsData.total}
        filteredResults={leadsData.leads.length}
        onFilterChange={onFilterChange}
        allLeads={leadsData.leads}
        isLoading={isFetching}
        stats={stats}
      />

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* View Toggle & Page Size */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200 shadow-sm">
              <button
                onClick={() =>
                  onFilterChange({
                    sortOrder: filters.sortOrder === "desc" ? "asc" : "desc",
                  })
                }
                className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 transition-colors"
                title={
                  filters.sortOrder === "desc" ? "الأحدث أولاً" : "الأقدم أولاً"
                }
              >
                {filters.sortOrder === "desc" ? (
                  <BarsArrowDownIcon className="w-5 h-5" />
                ) : (
                  <BarsArrowUpIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="flex items-center bg-gray-100 rounded-lg p-1 space-x-2 border border-gray-200 shadow-sm">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === "table"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="عرض كجدول"
              >
                <TableCellsIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="عرض كبطاقات"
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>

              <PageSizeSelect
                pageSize={pageSize}
                onChange={onPageSizeChange}
                className="hidden sm:block"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateLead}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-md whitespace-nowrap"
          >
            <PlusIcon className="w-4 h-4 ml-2" />
            إضافة عميل
          </button>
        </div>
      </div>

      {/* Leads List/Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden relative min-h-[400px]">
        {/* Loading Overlay */}
        {isFetching && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-50 flex items-center justify-center transition-all duration-300 animate-in fade-in">
            <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 scale-100 animate-in zoom-in-95 duration-300">
              <div className="relative">
                <LoadingSpinner size="lg" className="text-blue-600" />
                <div className="absolute inset-0 blur-lg opacity-20 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-base font-bold text-gray-900 tracking-tight">
                  تحديث البيانات
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  يرجى الانتظار قليلاً...
                </span>
              </div>
            </div>
          </div>
        )}
        <div className="px-6 py-4 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-medium text-gray-900">
            العملاء المحتملين
          </h3>
          {leadsData.leads.length > 0 && children}
        </div>

        {leadsData.leads.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto h-12 w-12 text-gray-400 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MagnifyingGlassIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              لا توجد نتائج
            </h3>
            <p className="text-gray-500 text-sm">
              جرب تغيير كلمات البحث أو الفلاتر
            </p>
            {filters.search && (
              <button
                onClick={() => onFilterChange({ search: "" })}
                className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                مسح البحث
              </button>
            )}
          </div>
        ) : (
          <div>
            {viewMode === "table" ? (
              <div className="hidden md:block">
                <LeadsTable
                  leads={leadsData.leads}
                  onEdit={handleEditLead}
                  onDelete={handleDeleteLead}
                  onStatusChange={handleStatusChange}
                  onClaimLead={handleClaimLead}
                  isDeleting={isDeleting}
                  isUpdatingStatus={isUpdatingStatus}
                  isClaiming={isClaiming}
                  getStatusBadgeColor={getStatusBadgeColor}
                  getStatusText={getStatusText}
                />
              </div>
            ) : null}

            {/* Grid/Mobile View */}
            <div
              className={`${
                viewMode === "table" ? "md:hidden" : ""
              } divide-y divide-gray-200 md:divide-y-0 md:grid md:grid-cols-2 xl:grid-cols-3 md:gap-4 md:p-4`}
            >
              {leadsData.leads.map((lead, index) => (
                <div
                  key={lead.id || `lead-${index}`}
                  className={
                    viewMode === "grid"
                      ? "bg-white border md:rounded-lg md:shadow-sm hover:shadow-md transition-shadow"
                      : ""
                  }
                >
                  <LeadCard
                    lead={lead}
                    onEdit={handleEditLead}
                    onDelete={handleDeleteLead}
                    onStatusChange={handleStatusChange}
                    onClaimLead={handleClaimLead}
                    isDeleting={isDeleting === lead.id}
                    isUpdatingStatus={isUpdatingStatus === lead.id}
                    isClaiming={isClaiming === lead.id}
                    getStatusBadgeColor={getStatusBadgeColor}
                    getStatusText={getStatusText}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        lead={editingLead}
        onLeadCreated={onLeadCreated}
        onLeadUpdated={onLeadUpdated}
      />

      {/* Profile Modal */}
      <LeadProfileModal
        isOpen={isProfileModalOpen}
        onClose={handleCloseProfileModal}
        leadId={currentLeadId}
        lead={leadProfile || null}
        isLoading={leadProfileLoading}
        onClaimLead={handleClaimLead}
        isClaiming={isClaiming === currentLeadId}
        onLeadUpdated={() => {
          refetchLeadProfile?.();
          onRefresh();
        }}
      />
    </div>
  );
}
