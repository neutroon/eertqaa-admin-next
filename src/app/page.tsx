"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

// Dashboard home page - redirects to dashboard

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Redirect authenticated users to dashboard
        window.location.href = "/dashboard";
      } else {
        // Redirect unauthenticated users to login
        window.location.href = "/login";
      }
    }
  }, [isAuthenticated, isLoading]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          جاري التحميل...
        </h2>
        <p className="text-gray-600">
          {isAuthenticated
            ? "يتم توجيهك إلى لوحة التحكم"
            : "يتم توجيهك إلى صفحة تسجيل الدخول"}
        </p>
      </div>
    </div>
  );
}
