"use client";

import { useState, useEffect, useMemo } from "react";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentRegistrations from "@/components/dashboard/RecentRegistrations";
import PopularCourses from "@/components/dashboard/PopularCourses";
import QuickActions from "@/components/dashboard/QuickActions";
import { leadsService } from "@/services/leads";
import { coursesService } from "@/services/courses";
import { Lead, LeadsStatsResponse, SelectedCourse } from "@/config/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DashboardPage() {
  const [leadsData, setLeadsData] = useState<{ total: number; leads: Lead[] }>({
    total: 0,
    leads: [],
  });
  const [selectedCourses, setSelectedCourses] = useState<SelectedCourse>({
    total: 0,
    selectedPrograms: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leadsStats, setLeadsStats] = useState<LeadsStatsResponse>({ claimedLeads: 0, unclaimedLeads: 0, totalLeads: 0, newLeadsThisMonth: 0, pendingLeads: 0, contactedLeads: 0, convertedLeads: 0, rejectedLeads: 0, success: false });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [leadsData, coursesData, leadsStatsData] = await Promise.all([
          leadsService.getAllLeads(),
          coursesService.getSelectedCourses(),
          leadsService.getLeadsStats(),
        ]);
        setLeadsData(leadsData || []);
        setSelectedCourses(coursesData);
        setLeadsStats(leadsStatsData);
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err.message || "فشل في تحميل البيانات");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const recentLeads = useMemo(() => {
    return [...leadsData.leads]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [leadsData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-2">حدث خطأ</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Stats Cards */}
      <DashboardStats
        totalCourses={selectedCourses.total}
        totalStudents={leadsStats.totalLeads}
        newStudents={leadsStats.newLeadsThisMonth}
        pendingLeads={leadsStats.pendingLeads}
        claimedLeads={leadsStats.claimedLeads}
        unclaimedLeads={leadsStats.unclaimedLeads}
      />
      {/* Popular Programs - Full Width */}
      <PopularCourses total={selectedCourses.total} selectedPrograms={selectedCourses.selectedPrograms} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentRegistrations leads={recentLeads} total={leadsData.total} />
        </div>

        {/* Quick Actions - Takes 1 column */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>

    </div>
  );
}
