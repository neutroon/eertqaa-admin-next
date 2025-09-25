"use client";

import { useState, useEffect } from "react";
import { Lead } from "@/config/api";
import { leadsService } from "@/services/leads";
import LeadsManagement from "@/components/dashboard/leads/LeadsManagement";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await leadsService.getAllLeads();
      setLeads(response.leads);
    } catch (error: any) {
      console.error("Failed to load leads:", error);
      setError("فشل في تحميل العملاء المحتملين");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadCreated = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleLeadUpdated = (updatedLead: Lead) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))
    );
  };

  const handleLeadDeleted = (leadId: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={loadLeads}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          إدارة العملاء المحتملين
        </h1>
        <p className="text-gray-600">
          إدارة طلبات العملاء المحتملين والتواصل معهم
        </p>
      </div>

      <LeadsManagement
        leads={leads}
        onLeadCreated={handleLeadCreated}
        onLeadUpdated={handleLeadUpdated}
        onLeadDeleted={handleLeadDeleted}
        onRefresh={loadLeads}
      />
    </div>
  );
}
