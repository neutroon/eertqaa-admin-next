"use client";

import { useState, useEffect, useMemo } from "react";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentRegistrations from "@/components/dashboard/RecentRegistrations";
import PopularCourses from "@/components/dashboard/PopularCourses";
import QuickActions from "@/components/dashboard/QuickActions";
import { leadsService } from "@/services/leads";
import { coursesService } from "@/services/courses";
import { Lead, Course } from "@/config/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [leadsData, coursesData] = await Promise.all([
          leadsService.getAllLeads(),
          coursesService.getAllCourses(),
        ]);
        setLeads(leadsData.leads || []);
        setCourses(coursesData.courses || []);
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err.message || "فشل في تحميل البيانات");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const newLeadsThisMonth = leads.filter((lead) => {
      const leadDate = new Date(lead.createdAt);
      return (
        leadDate.getMonth() === currentMonth &&
        leadDate.getFullYear() === currentYear
      );
    }).length;

    const pendingLeads = leads.filter((l) => l.status === "pending").length;

    return {
      totalCourses: courses.length,
      totalStudents: leads.length,
      newStudents: newLeadsThisMonth,
      pendingLeads,
    };
  }, [leads, courses]);

  // Calculate popular courses from lead selections
  const popularCourses = useMemo(() => {
    const programCounts: Record<string, number> = {};

    leads.forEach((lead) => {
      const program = lead.selectedProgram;
      programCounts[program] = (programCounts[program] || 0) + 1;
    });

    return Object.entries(programCounts)
      .map(([name, enrollments]) => ({
        id: name,
        name,
        category: "برامج إرتقاء",
        enrollments,
        rating: 4.8,
        status: "active" as const,
      }))
      .sort((a, b) => b.enrollments - a.enrollments)
      .slice(0, 5);
  }, [leads]);

  // Get recent leads
  const recentLeads = useMemo(() => {
    return [...leads]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [leads]);

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
        totalCourses={stats.totalCourses}
        totalStudents={stats.totalStudents}
        newStudents={stats.newStudents}
        pendingLeads={stats.pendingLeads}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentRegistrations leads={recentLeads} />
        </div>

        {/* Quick Actions - Takes 1 column */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>

      {/* Popular Programs - Full Width */}
      <PopularCourses courses={popularCourses} />
    </div>
  );
}
