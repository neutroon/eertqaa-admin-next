import { apiService } from "./api";
import {
  API_CONFIG,
  LoginRequest,
  LoginResponse,
  ApiResponse,
} from "@/config/api";

export class AuthService {
  // Login method
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log("🔐 Attempting login with credentials:", {
        phone: credentials.phone,
        password: "***",
      });

      const response = await apiService.post<LoginResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      console.log("🔐 Login response:", response);

      if (response.success) {
        // Store user data (cookies are handled automatically by the browser)
        localStorage.setItem("adminUser", JSON.stringify(response?.data));
        localStorage.setItem("isAuthenticated", "true");

        console.log("✅ Login successful, user data stored");
        return response?.data as LoginResponse;
      } else {
        console.error("❌ Login failed:", response.message);
        throw new Error(response.message || "Login failed");
      }
    } catch (error: any) {
      console.error("❌ Login error:", error);
      throw error;
    }
  }

  // Logout method
  async logout(): Promise<void> {
    try {
      // Try to call logout endpoint if authenticated (this will clear server-side cookies)
      if (this.isAuthenticated()) {
        try {
          await apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
          // If logout endpoint fails, still clear local storage
          console.warn("Logout endpoint failed:", error);
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local storage (cookies are cleared by server or browser)
      this.clearAuthData();
    }
  }

  // Get current user profile
  async getProfile(): Promise<any> {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.ADMIN.PROFILE);

      if (response.success && response.data) {
        // Update stored user data
        localStorage.setItem("adminUser", JSON.stringify(response.data));
        return response.data;
      } else {
        throw new Error(response.message || "Failed to fetch profile");
      }
    } catch (error: any) {
      console.error("Get profile error:", error);
      throw error;
    }
  }

  // Refresh token method
  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await apiService.post<{
        token: string;
        refreshToken?: string;
      }>(API_CONFIG.ENDPOINTS.AUTH.REFRESH, { refreshToken });

      if (response.success && response.data) {
        localStorage.setItem("authToken", response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }
        return response.data.token;
      } else {
        throw new Error(response.message || "Token refresh failed");
      }
    } catch (error: any) {
      console.error("Token refresh error:", error);
      this.clearAuthData();
      throw error;
    }
  }

  // Check if user is authenticated (based on local storage)
  isAuthenticated(): boolean {
    const isAuth = localStorage.getItem("isAuthenticated");
    const userData = localStorage.getItem("adminUser");
    return !!(isAuth === "true" && userData);
  }

  // Verify authentication with server (checks if cookie is valid)
  async verifyAuthentication(): Promise<boolean> {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.ADMIN.PROFILE);
      if (response.success && response.data) {
        // Update stored user data with fresh data from server
        localStorage.setItem("adminUser", JSON.stringify(response.data));
        localStorage.setItem("isAuthenticated", "true");
        return true;
      }
      return false;
    } catch (error) {
      console.warn("Authentication verification failed:", error);
      // Clear invalid auth state
      this.clearAuthData();
      return false;
    }
  }

  // Get stored user data
  getCurrentUser(): any | null {
    try {
      const userData = localStorage.getItem("adminUser");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }

  // Get stored auth token
  getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  // Clear authentication data
  clearAuthData(): void {
    // Remove local storage data (cookies are handled by server/browser)
    localStorage.removeItem("adminUser");
    localStorage.removeItem("isAuthenticated");

    // Clean up any remaining token data (legacy)
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
  }

  // Validate token expiration (if you have JWT tokens)
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      // If using JWT tokens, you can decode and check expiration
      // For now, we'll rely on API responses to determine if token is expired
      return false;
    } catch (error) {
      return true;
    }
  }
}

// Create and export a singleton instance
export const authService = new AuthService();
