"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/services/auth";
import { ApiError } from "@/config/api";
import { toast } from "sonner";

export enum UserRole {
  ADMIN = "ADMIN",
  SALES_AGENT = "SALES_AGENT",
}

interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    phone: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = authService.getCurrentUser();
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);

            // Verify authentication with server (checks cookie validity)
            try {
              const isValid = await authService.verifyAuthentication();
              if (isValid) {
                // Update with fresh user data from server
                const freshUserData = authService.getCurrentUser();
                setUser(freshUserData);
              } else {
                // Cookie is invalid, clear auth state
                setUser(null);
                setIsAuthenticated(false);
              }
            } catch (error) {
              console.warn("Failed to verify authentication:", error);
              // Keep local data if verification fails due to network issues
            }
          } else {
            // Clear invalid auth state
            authService.clearAuthData();
          }
        } else {
          // Check if there's a valid cookie without local storage
          try {
            const isValid = await authService.verifyAuthentication();
            if (isValid) {
              const userData = authService.getCurrentUser();
              setUser(userData);
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.warn("No valid authentication found:", error);
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        authService.clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // Redirect logic
    if (!isLoading) {
      const isLoginPage = pathname === "/login";
      const isDashboardPage = pathname.startsWith("/dashboard");

      if (!isAuthenticated && isDashboardPage) {
        router.push("/login");
      } else if (isAuthenticated && isLoginPage) {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const login = async (
    phone: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // console.log("🔐 AuthContext: Starting login process");
      const response = await authService.login({ phone, password });
      // console.log("🔐 AuthContext: Login response received:", response);

      setUser(response);
      setIsAuthenticated(true);

      // console.log("🔐 AuthContext: Login successful, returning success");
      return { success: true };
    } catch (error: any) {
      // console.error("🔐 AuthContext: Login error:", error);

      let errorMessage = "حدث خطأ أثناء تسجيل الدخول";

      if (error instanceof ApiError) {
        switch (error.status) {
          case 401:
            errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
            break;
          case 400:
            errorMessage = "يرجى التحقق من البيانات المدخلة";
            break;
          case 429:
            errorMessage =
              "تم تجاوز عدد المحاولات المسموحة. يرجى المحاولة لاحقاً";
            break;
          case 500:
            errorMessage = "خطأ في الخادم. يرجى المحاولة لاحقاً";
            break;
          case 0:
            errorMessage =
              "تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت";
            break;
          default:
            errorMessage = error.message || errorMessage;
        }
      }

      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // console.error("Logout error:", error);
      toast.error("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      router.push("/login");
    }
  };

  const refreshUserProfile = async () => {
    try {
      if (isAuthenticated) {
        const isValid = await authService.verifyAuthentication();
        if (isValid) {
          const userData = authService.getCurrentUser();
          setUser(userData);
        } else {
          // Cookie is invalid, logout user
          await logout();
        }
      }
    } catch (error) {
      console.error("Failed to refresh user profile:", error);
      // If profile refresh fails, might need to logout
      if (error instanceof ApiError && error.status === 401) {
        await logout();
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
