import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentRegistrations from "@/components/dashboard/RecentRegistrations";
import PopularCourses from "@/components/dashboard/PopularCourses";
import QuickActions from "@/components/dashboard/QuickActions";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome section - hidden on mobile since it's in header */}
      <div className="hidden md:block">
        <h1 className="text-3xl font-bold text-gray-900">
          لوحة التحكم الرئيسية
        </h1>
        <p className="text-gray-600 mt-2">
          مرحباً بك في لوحة تحكم منصة إرتقاء التعليمية
        </p>
      </div>

      {/* Stats and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardStats />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentRegistrations />
        <PopularCourses />
      </div>
    </div>
  );
}
