"use client";

import { useState } from "react";
import AnalyticsDashboard from "@/components/dashboard/analytics/AnalyticsDashboard";
import ComingSoonOverlay from "@/components/common/ComingSoonOverlay";

export default function AnalyticsPage() {
  const [showComingSoon, setShowComingSoon] = useState(true);

  return (
    <>
      <div className="space-y-6">
        {/* <div>
          <h1 className="text-3xl font-bold text-gray-900">
            التحليلات والإحصائيات
          </h1>
          <p className="text-gray-600 mt-2">
            تحليل أداء البرامج وسلوك المستخدمين
          </p>
        </div> */}

        <AnalyticsDashboard />
      </div>

      {/* Coming Soon Overlay */}
      <ComingSoonOverlay
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        title="التقارير والتحليلات"
        description="صفحة التحليلات والإحصائيات قيد التطوير. ستتمكن من رؤية تحليلات مفصلة عن أداء البرامج والمتدربين قريباً."
        expectedDate="👀"
      />
    </>
  );
}
