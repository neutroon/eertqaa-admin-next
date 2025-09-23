"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

// Dashboard home page - redirects to dashboard

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard immediately
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          جاري التحميل...
        </h2>
        <p className="text-gray-600">يتم توجيهك إلى لوحة التحكم</p>
      </div>
    </div>
  );
}
