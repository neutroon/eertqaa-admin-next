import { apiService } from "./api";
import { API_CONFIG, ApiResponse, UserRole } from "@/config/api";

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  salesAgentProfile?: {
    id: string;
    _count: {
      assignedLeads: number;
    };
  };
}

export interface ListUsersResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export class UserService {
  async listUsers(params: {
    role?: UserRole;
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const query = new URLSearchParams();
    if (params.role) query.append("role", params.role);
    if (params.isActive !== undefined) query.append("isActive", String(params.isActive));
    if (params.search) query.append("search", params.search);
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));

    const response = await apiService.get<ListUsersResponse>(
      `${API_CONFIG.ENDPOINTS.USERS.LIST}?${query.toString()}`
    );
    return response.data;
  }

  async getUser(id: string) {
    const response = await apiService.get<User>(
      `${API_CONFIG.ENDPOINTS.USERS.GET_BY_ID}/${id}/details`
    );
    return response.data;
  }

  async createUser(data: Partial<User> & { password?: string }) {
    const response = await apiService.post<User>(
      API_CONFIG.ENDPOINTS.USERS.CREATE,
      data
    );
    return response.data;
  }

  async updateUser(id: string, data: Partial<User> & { password?: string }) {
    const response = await apiService.put<User>(
      `${API_CONFIG.ENDPOINTS.USERS.UPDATE}/${id}`,
      data
    );
    return response.data;
  }

  async toggleStatus(id: string) {
    const response = await apiService.patch<User>(
      `${API_CONFIG.ENDPOINTS.USERS.TOGGLE_STATUS}/${id}/toggle-status`
    );
    return response.data;
  }

  async deleteUser(id: string) {
    const response = await apiService.delete(
      `${API_CONFIG.ENDPOINTS.USERS.DELETE}/${id}`
    );
    return response.success;
  }

  async getOnlineUsers() {
    const response = await apiService.get<{ count: number; users: any[] }>(
      API_CONFIG.ENDPOINTS.USERS.ONLINE_USERS
    );
    return response.data;
  }
}

export const userService = new UserService();
