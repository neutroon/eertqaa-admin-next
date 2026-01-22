import { apiService } from "./api";
import {
  API_CONFIG,
  Lead,
  CreateLeadRequest,
  UpdateLeadRequest,
  LeadsResponse,
  ApiResponse,
  LeadsStatsResponse,
  LeadFeedback,
  AddLeadFeedbackRequest,
} from "@/config/api";

export class LeadsService {
  // Get all leads
  async getAllLeads(params?: {
    page?: number;
    limit?: number;
    status?: string;
    isLocked?: string;
    search?: string;
    assignedToSalesId?: string;
    "orderBy.createdAt"?: "asc" | "desc";
  }): Promise<LeadsResponse> {
    try {
      // Map searchTerm to name for the API if needed, or pass directly
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams.page = params.page.toString();
      if (params?.limit) queryParams.limit = params.limit.toString();
      if (params?.status && params.status !== "")
        queryParams.status = params.status;
      if (params?.isLocked) queryParams.isLocked = params.isLocked;
      if (params?.search) queryParams.search = params.search;
      if (params?.assignedToSalesId)
        queryParams.assignedToSalesId = params.assignedToSalesId;
      if (params?.["orderBy.createdAt"])
        queryParams["orderBy.createdAt"] = params["orderBy.createdAt"];

      const response = await apiService.get<LeadsResponse>(
        API_CONFIG.ENDPOINTS.LEADS.GET_ALL,
        queryParams
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to fetch leads");
      }
    } catch (error: any) {
      console.error("Get leads error:", error);
      throw error;
    }
  }

  // Get leads stats
  async getLeadsStats(): Promise<LeadsStatsResponse> {
    try {
      const response = await apiService.get<LeadsStatsResponse>(
        API_CONFIG.ENDPOINTS.LEADS.STATS
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to fetch leads stats");
      }
    } catch (error: any) {
      console.error("Get leads stats error:", error);
      throw error;
    }
  }

  // Create a new lead
  async createLead(leadData: CreateLeadRequest): Promise<Lead> {
    try {
      const response = await apiService.post<Lead>(
        API_CONFIG.ENDPOINTS.LEADS.CREATE,
        leadData
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to create lead");
      }
    } catch (error: any) {
      console.error("Create lead error:", error);
      throw error;
    }
  }

  // Update an existing lead
  async updateLead(leadId: string, leadData: UpdateLeadRequest): Promise<Lead> {
    try {
      const response = await apiService.put<Lead>(
        `${API_CONFIG.ENDPOINTS.LEADS.UPDATE}/${leadId}`,
        leadData
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to update lead");
      }
    } catch (error: any) {
      console.error("Update lead error:", error);
      throw error;
    }
  }

  // Update only the status of a lead (more efficient for status changes)
  async updateLeadStatus(
    leadId: string,
    status: "pending" | "contacted" | "converted" | "rejected"
  ): Promise<Lead> {
    try {
      const response = await apiService.put<Lead>(
        `${API_CONFIG.ENDPOINTS.LEADS.UPDATE}/${leadId}`,
        { status }
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to update lead status");
      }
    } catch (error: any) {
      console.error("Update lead status error:", error);
      throw error;
    }
  }

  // Add feedback to a lead
  async addLeadFeedback(feedbackData: any): Promise<LeadFeedback> {
    try {
      const response = await apiService.post<LeadFeedback>(
        `/api/v1/leads/feedback`,
        feedbackData
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to add lead feedback");
      }
    } catch (error: any) {
      console.error("Add lead feedback error:", error);
      throw error;
    }
  }

  // Delete a lead
  async deleteLead(leadId: string): Promise<void> {
    try {
      const response = await apiService.delete(
        `${API_CONFIG.ENDPOINTS.LEADS.DELETE}/${leadId}`
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to delete lead");
      }
    } catch (error: any) {
      console.error("Delete lead error:", error);
      throw error;
    }
  }

  async updateLeadIsLocked(leadId: string, isLocked: boolean): Promise<Lead> {
    try {
      const response = await apiService.put<Lead>(
        `${API_CONFIG.ENDPOINTS.LEADS.UPDATE}/${leadId}`,
        { isLocked }
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to update lead isLocked");
      }
    } catch (error: any) {
      console.error("Update lead isLocked error:", error);
      throw error;
    }
  }

  async getLeadById(leadId: string): Promise<Lead> {
    try {
      const response = await apiService.get<Lead>(
        `${API_CONFIG.ENDPOINTS.LEADS.GET_BY_ID}/${leadId}`
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to get lead by id");
      }
    } catch (error: any) {
      console.error("Get lead by id error:", error);
      throw error;
    }
  }

  async claimLead(leadId: string): Promise<Lead> {
    try {
      const response = await apiService.post<Lead>(
        `${API_CONFIG.ENDPOINTS.LEADS.CLAIM}/${leadId}`,
        {}
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to claim lead");
      }
    } catch (error: any) {
      console.error("Claim lead error:", error);
      throw error;
    }
  }
}

export const leadsService = new LeadsService();
