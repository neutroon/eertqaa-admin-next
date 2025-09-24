import AnalyticsDashboard from "@/components/dashboard/analytics/AnalyticsDashboard";

export default function AnalyticsPage() {
  return (
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
  );
}
