"use client";

import { useState } from "react";
import StudentManagement from "@/components/dashboard/students/StudentManagement";
import ComingSoonOverlay from "@/components/common/ComingSoonOverlay";

export default function StudentsPage() {
  const [showComingSoon, setShowComingSoon] = useState(true);

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة المتدربين</h1>
          <p className="text-gray-600 mt-2">
            إدارة تسجيلات المتدربين ومعلوماتهم
          </p>
        </div>

        <StudentManagement />
      </div>

      {/* Coming Soon Overlay */}
      <ComingSoonOverlay
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        title="إدارة المتدربين"
        description="صفحة إدارة المتدربين قيد التطوير. ستتمكن من إدارة المتدربين وتتبع تقدمهم قريباً."
        expectedDate="👀"
      />
    </>
  );
}
