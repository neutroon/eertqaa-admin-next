import { apiService } from "./api";
import { NotificationResponse, Notification } from "@/types/notifications";
import { ApiResponse } from "@/config/api";

class NotificationService {
  private readonly endpoint = "/api/v1/notifications";

  /**
   * List all notifications for the current user
   * @param page Page number
   * @param limit Number of items per page
   */
  async getNotifications(page = 1, limit = 20): Promise<ApiResponse<NotificationResponse>> {
    return apiService.get<NotificationResponse>(this.endpoint, {
      page: page.toString(),
      limit: limit.toString(),
    });
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<ApiResponse<void>> {
    return apiService.put<void>(`${this.endpoint}/read-all`);
  }

  /**
   * Mark a specific notification as read
   * @param notificationId The notification ID to mark as read
   */
  async markAsRead(notificationId: string): Promise<ApiResponse<void>> {
    return apiService.put<void>(`${this.endpoint}/${notificationId}/read`);
  }
}

export const notificationService = new NotificationService();
