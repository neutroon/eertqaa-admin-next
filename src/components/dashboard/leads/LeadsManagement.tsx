"use client";

import { useState } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { Lead } from "@/config/api";
import { leadsService } from "@/services/leads";
import LeadModal from "./LeadModal";
import LeadCard from "./LeadCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  // Filter leads based on search term and status
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.selectedProgram.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

      // Cast newStatus to the proper type
      const statusValue = newStatus as
        | "pending"
        | "contacted"
        | "converted"
        | "rejected";

      // Use the more efficient status-only update method
      const updatedLead = await leadsService.updateLeadStatus(
        leadId,
        statusValue
      );

      // Update the local state with the returned data from API
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
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="البحث في العملاء المحتملين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pe-3 ps-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">في الانتظار</option>
              <option value="contacted">تم التواصل</option>
              <option value="converted">تم التحويل</option>
              <option value="rejected">مرفوض</option>
            </select>
            <FunnelIcon className="absolute start-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* <div className="flex gap-3"> */}
        {/* <button
            onClick={exportLeads}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowDownTrayIcon className="w-4 h-4 ml-2" />
            تصدير
          </button> */}

        <button
          disabled
          onClick={handleCreateLead}
          className="inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="w-4 h-4 ml-2" />
          إضافة عميل محتمل
        </button>
        {/* </div> */}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">
                إجمالي العملاء
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {leads.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">في الانتظار</p>
              <p className="text-2xl font-semibold text-yellow-600">
                {leads.filter((l) => l.status === "pending").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">مرفوض</p>
              <p className="text-2xl font-semibold text-red-600">
                {leads.filter((l) => l.status === "rejected").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">تم التواصل</p>
              <p className="text-2xl font-semibold text-blue-600">
                {leads.filter((l) => l.status === "contacted").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">تم التحويل</p>
              <p className="text-2xl font-semibold text-green-600">
                {leads.filter((l) => l.status === "converted").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            العملاء المحتملين ({filteredLeads.length})
          </h3>
        </div>

        {filteredLeads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">لا توجد عملاء محتملين</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-2 text-blue-600 hover:text-blue-500"
              >
                مسح البحث
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onEdit={handleEditLead}
                onDelete={handleDeleteLead}
                onStatusChange={handleStatusChange}
                isDeleting={isDeleting === lead.id}
                isUpdatingStatus={isUpdatingStatus === lead.id}
                getStatusBadgeColor={getStatusBadgeColor}
                getStatusText={getStatusText}
              />
            ))}
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
