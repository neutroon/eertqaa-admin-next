"use client";

import {
  BookOpenIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { CheckCircleIcon, UserCheckIcon, UserPlusIcon } from "lucide-react";
import LoadingSpinner from "../ui/LoadingSpinner";

interface DashboardStatsProps {
  totalCourses: number;
  totalStudents: number;
  newStudents: number;
  pendingLeads: number;
  claimedLeads: number;
  unclaimedLeads: number;
  loadingStats: boolean;
}

export default function DashboardStats({
  totalCourses,
  totalStudents,
  newStudents,
  pendingLeads,
  claimedLeads,
  unclaimedLeads,
  loadingStats,
}: DashboardStatsProps) {
  const stats = [
    {
      name: "البرامج النشطة",
      value: totalCourses,
      icon: BookOpenIcon,
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      change: "+2",
      changePositive: true,
    },
    {
      name: "إجمالي المتدربين",
      value: totalStudents,
      icon: UserGroupIcon,
      gradient: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      change: "+12%",
      changePositive: true,
    },
    {
      name: "التسجيلات الجديدة",
      value: newStudents,
      subtext: "هذا الشهر",
      icon: ClipboardDocumentListIcon,
      gradient: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      change: `+${newStudents}`,
      changePositive: true,
    },
    {
      name: "في الانتظار",
      value: pendingLeads,
      subtext: "يحتاج متابعة",
      icon: ClockIcon,
      gradient: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      change: pendingLeads > 0 ? "عاجل" : "ممتاز",
      changePositive: pendingLeads === 0,
    },
    {
      name: "عملاء قيد المتابعة",
      value: claimedLeads,
      subtext: "تم التخصيص لفريق المبيعات",
      icon: CheckCircleIcon,
      gradient: "from-indigo-500 to-blue-600",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      change: `${claimedLeads}`,
      changePositive: true,
      badge: claimedLeads > 0 ? "نشط" : null,
      colSpan: 2,
    },
    {
      name: "عملاء بانتظار المتابعة",
      value: unclaimedLeads,
      subtext: "يحتاج التخصيص لفريق المبيعات",
      icon: UserPlusIcon,
      gradient: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      change: unclaimedLeads > 5 ? "عاجل" : "متاح",
      changePositive: unclaimedLeads <= 5,
      badge: unclaimedLeads > 0 ? "متاح" : null,
      colSpan: 2,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className={clsx(
            `group relative overflow-hidden rounded-xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1`,
            {
              "sm:col-span-2": stat.colSpan === 2,
            }
          )}
        >
          {/* Gradient background on hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
          ></div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div
                className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              {stat.change && (
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    stat.changePositive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {stat.change}
                </span>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.name}
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {loadingStats ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  stat.value.toLocaleString("ar-EG")
                )}
              </p>
              {stat.subtext && (
                <p className="text-xs text-gray-500">{stat.subtext}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
