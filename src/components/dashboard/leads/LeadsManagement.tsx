"use client";

import { useState, useMemo, useEffect } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TableCellsIcon,
  Squares2X2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BarsArrowUpIcon,
  BarsArrowDownIcon,
} from "@heroicons/react/24/outline";
import { Lead } from "@/config/api";
import { leadsService } from "@/services/leads";
import LeadModal from "./LeadModal";
import LeadCard from "./LeadCard";
import LeadsTable from "./LeadsTable";
import PageSizeSelect from "./PageSizeSelect";

interface LeadsManagementProps {
  leads: Lead[];
  onLeadCreated: (lead: Lead) => void;
  onLeadUpdated: (lead: Lead) => void;
  onLeadDeleted: (leadId: string) => void;
  onRefresh: () => void;
}



export default function LeadsManagement({
  leads,
  onLeadCreated,
  onLeadUpdated,
  onLeadDeleted,
  onRefresh,
}: LeadsManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  // CHANGED: Default status filter to 'pending' as requested
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter and Sort leads
  const processedLeads = useMemo(() => {
    let result = [...leads];

    // 1. Sort by Date
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    // 2. Filter
    result = result.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.selectedProgram.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return result;
  }, [leads, searchTerm, statusFilter, sortOrder]);

  // Pagination Logic
  const totalPages = Math.ceil(processedLeads.length / itemsPerPage);
  const paginatedLeads = processedLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

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
        return "تم التحويل";
      case "rejected":
        return "مرفوض";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="flex flex-col sm:flex-row gap-4 flex-2 w-full lg:w-auto">
          {/* Search */}
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="البحث بالاسم أو رقم الهاتف ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full ps-10 pe-10 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
          </div>

          {/* Status Filter */}
          {/* <div className="relative min-w-[160px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pe-3 ps-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer bg-white"
            >
              <option value="pending">في الانتظار (الافتراضي)</option>
              <option value="all">جميع الحالات</option>
              <option value="contacted">تم التواصل</option>
              <option value="converted">تم التحويل</option>
              <option value="rejected">مرفوض</option>
            </select>
            <FunnelIcon className="absolute start-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div> */}
        </div>

        <div className="flex items-center gap-3 w-full flex-1 sm:w-auto justify-end">
          {/* View Toggle */}
          <div className="flex items-center gap-1">
            <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
              <button
                onClick={() =>
                  setSortOrder((current) => (current === "desc" ? "asc" : "desc"))
                }
                className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 transition-colors"
                title={
                  sortOrder === "desc" ? "الأحدث أولاً" : "الأقدم أولاً"
                }
              >
                {sortOrder === "desc" ? (
                  <BarsArrowDownIcon className="w-5 h-5" />
                ) : (
                  <BarsArrowUpIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="flex items-center bg-gray-100 rounded-lg p-1 space-x-2 border border-gray-200">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-all ${viewMode === "table"
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
                title="عرض كجدول"
              >
                <TableCellsIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-all ${viewMode === "grid"
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
                title="عرض كبطاقات"
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            onClick={handleCreateLead}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm whitespace-nowrap"
          >
            <PlusIcon className="w-4 h-4 ml-2" />
            إضافة عميل
          </button>
        </div>
      </div>

      {/* Stats - Compact Version */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div
          onClick={() => setStatusFilter("all")}
          className={`bg-white p-4 rounded-lg shadow-sm border cursor-pointer transition-all hover:shadow-md ${statusFilter === "all" ? "border-gray-400 ring-1 ring-gray-400" : "border-gray-100"
            }`}
        >
          <p className="text-xs font-medium text-gray-500 mb-1">
            إجمالي العملاء
          </p>
          <p className="text-xl font-bold text-gray-900">{leads.length}</p>
        </div>

        <div
          onClick={() => setStatusFilter("pending")}
          className={`bg-white p-4 rounded-lg shadow-sm border cursor-pointer transition-all hover:shadow-md ${statusFilter === "pending" ? "border-yellow-400 ring-1 ring-yellow-400" : "border-gray-100"
            }`}
        >
          <p className="text-xs font-medium text-gray-500 mb-1">في الانتظار</p>
          <p className="text-xl font-bold text-yellow-600">
            {leads.filter((l) => l.status === "pending").length}
          </p>
        </div>

        <div
          onClick={() => setStatusFilter("contacted")}
          className={`bg-white p-4 rounded-lg shadow-sm border cursor-pointer transition-all hover:shadow-md ${statusFilter === "contacted" ? "border-blue-400 ring-1 ring-blue-400" : "border-gray-100"
            }`}
        >
          <p className="text-xs font-medium text-gray-500 mb-1">تم التواصل</p>
          <p className="text-xl font-bold text-blue-600">
            {leads.filter((l) => l.status === "contacted").length}
          </p>
        </div>

        <div
          onClick={() => setStatusFilter("converted")}
          className={`bg-white p-4 rounded-lg shadow-sm border cursor-pointer transition-all hover:shadow-md ${statusFilter === "converted" ? "border-green-400 ring-1 ring-green-400" : "border-gray-100"
            }`}
        >
          <p className="text-xs font-medium text-gray-500 mb-1">تم الحجز</p>
          <p className="text-xl font-bold text-green-600">
            {leads.filter((l) => l.status === "converted").length}
          </p>
        </div>

        <div
          onClick={() => setStatusFilter("rejected")}
          className={`bg-white p-4 rounded-lg shadow-sm border cursor-pointer transition-all hover:shadow-md ${statusFilter === "rejected" ? "border-red-400 ring-1 ring-red-400" : "border-gray-100"
            }`}
        >
          <p className="text-xs font-medium text-gray-500 mb-1">
            غير مهتم
          </p>
          <p className="text-xl font-bold text-red-600">
            {leads.filter((l) => l.status === "rejected").length}
          </p>
        </div>
      </div>

      {/* Leads List/Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-medium text-gray-900">
            العملاء المحتملين{" "}
            <span className="text-gray-500 text-sm font-normal">
              ({processedLeads.length})
            </span>
          </h3>
          {processedLeads.length > 0 && (
            <span className="text-xs text-gray-500">
              عرض {paginatedLeads.length} من أصل {processedLeads.length}
            </span>
          )}
        </div>

        {processedLeads.length === 0 ? (
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
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                مسح البحث
              </button>
            )}
            {statusFilter === "pending" && !searchTerm && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg inline-block">
                <p className="text-green-800 text-sm font-medium">
                  🎉 رائع! لقد قمت بالرد على جميع العملاء الجدد.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {viewMode === "table" ? (
              <div className="hidden md:block">
                <LeadsTable
                  leads={paginatedLeads}
                  onEdit={handleEditLead}
                  onDelete={handleDeleteLead}
                  onStatusChange={handleStatusChange}
                  isDeleting={isDeleting}
                  isUpdatingStatus={isUpdatingStatus}
                  getStatusBadgeColor={getStatusBadgeColor}
                  getStatusText={getStatusText}
                />
              </div>
            ) : null}

            {/* Grid View (Always visible on mobile, togglable on desktop) */}
            <div
              className={`${viewMode === "table" ? "md:hidden" : ""
                } divide-y divide-gray-200 md:divide-y-0 md:grid md:grid-cols-2 xl:grid-cols-3 md:gap-4 md:p-4`}
            >
              {paginatedLeads.map((lead) => (
                <div
                  key={lead.id}
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
                    isDeleting={isDeleting === lead.id}
                    isUpdatingStatus={isUpdatingStatus === lead.id}
                    getStatusBadgeColor={getStatusBadgeColor}
                    getStatusText={getStatusText}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 0 && (
          <div className="bg-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200">
            {/* Left Side: Page Size & Info */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <PageSizeSelect
                pageSize={itemsPerPage}
                onChange={(size) => {
                  setItemsPerPage(size);
                  setCurrentPage(1);
                }}
              />

              <p className="text-sm text-gray-500">
                عرض <span className="font-medium text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span>{" "}
                إلى{" "}
                <span className="font-medium text-gray-900">
                  {Math.min(currentPage * itemsPerPage, processedLeads.length)}
                </span>{" "}
                من <span className="font-medium text-gray-900">{processedLeads.length}</span>{" "}
                نتائج
              </p>
            </div>

            {/* Right Side: Navigation Buttons */}
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
              dir="ltr"
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
              </button>

              {/* Pagination Numbers Logic */}
              <div className="hidden md:flex">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          aria-current={currentPage === page ? "page" : undefined}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 ring-1 ring-inset ring-gray-300 ${currentPage === page
                            ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 border-blue-600"
                            : "text-gray-900 hover:bg-gray-50"
                            }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span
                          key={page}
                          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  }
                )}
              </div>

              {/* Mobile Simple Page Display */}
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 md:hidden">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </nav>
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
    </div>
  );
}
