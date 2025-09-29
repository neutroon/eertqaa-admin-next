"use client";

import { useState } from "react";
import TestimonialsManagement from "@/components/dashboard/testimonials/TestimonialsManagement";
import ComingSoonOverlay from "@/components/common/ComingSoonOverlay";

export default function TestimonialsPage() {
  const [showComingSoon, setShowComingSoon] = useState(true);

  return (
    <>
      <div className="space-y-6">
        {/* <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الشهادات</h1>
          <p className="text-gray-600 mt-2">إدارة شهادات المتدربين وآرائهم</p>
        </div> */}

        <TestimonialsManagement />
      </div>

      {/* Coming Soon Overlay */}
      <ComingSoonOverlay
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        title="إدارة التعليقات"
        description="صفحة إدارة التعليقات قيد التطوير. ستتمكن من إدارة وتنظيم التعليقات قريباً."
        expectedDate="👀"
      />
    </>
  );
}
