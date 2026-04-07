import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { notificationService } from "@/services/notifications";
import { toast } from "sonner";
import { NotificationResponse } from "@/types/notifications";

/**
 * Hook to fetch notifications with infinite scrolling/load more
 */
export const useInfiniteNotifications = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["notifications-infinite", limit],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await notificationService.getNotifications(pageParam as number, limit);
      if (!response.data) throw new Error("No data received");
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: NotificationResponse) => {
      if (lastPage && lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60,
  });
};

/**
 * Hook to fetch notifications with standard pagination
 * @param page Current page
 * @param limit Items per page
 */
export const useNotifications = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ["notifications", page, limit],
    queryFn: async () => {
      const response = await notificationService.getNotifications(page, limit);
      return response.data;
    },
    staleTime: 1000 * 60, // 1 minute
  });
};

/**
 * Hook to mark all notifications as read
 */
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      // Invalidate notifications queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      // toast.success("تم تحديث جميع التنبيهات كمقروءة");
    },
    onError: (error: any) => {
      toast.error(error.message || "فشل تحديث التنبيهات");
    },
  });
};

/**
 * Hook to mark a specific notification as read
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationService.markAsRead(notificationId),
    onSuccess: (_, notificationId) => {
      // Invalidate notifications queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      // Optimistically update if needed, or just invalidate
    },
    onError: (error: any) => {
      toast.error(error.message || "فشل تحديث التنبيه");
    },
  });
};
