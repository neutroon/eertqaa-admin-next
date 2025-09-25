import { apiService } from "./api";
import {
  API_CONFIG,
  Lead,
  CreateLeadRequest,
  UpdateLeadRequest,
  LeadsResponse,
  ApiResponse,
} from "@/config/api";

export class LeadsService {
  // Get all leads
  async getAllLeads(): Promise<LeadsResponse> {
    try {
      const response = await apiService.get<LeadsResponse>(
        API_CONFIG.ENDPOINTS.LEADS.GET_ALL
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
}

export const leadsService = new LeadsService();
