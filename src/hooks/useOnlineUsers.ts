import { apiService } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { API_CONFIG } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";

export function useOnlineUsers() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const { data, isLoading, error } = useQuery({
    queryKey: ["online-users"],
    queryFn: () =>
      apiService
        .get(
          isAdmin
            ? API_CONFIG.ENDPOINTS.USERS.ONLINE_USERS
            : API_CONFIG.ENDPOINTS.USERS.ONLINE_SALES_AGENTS,
        )
        .then((res) => res.data),
  });

  return { data, isLoading, error };
}
