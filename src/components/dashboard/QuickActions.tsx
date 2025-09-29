"use client";

import {
  PlusIcon,
  UserGroupIcon,
  ChartBarIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function QuickActions() {
  const actions = [
    {
      name: "إضافة برنامج جديد",
      description: "إنشاء برنامج تعليمي جديد",
      href: "/dashboard/courses?action=add",
      icon: PlusIcon,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      name: "إضافة متدرب",
      description: "تسجيل متدرب جديد",
      href: "/dashboard/students?action=add",
      icon: UserGroupIcon,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      name: "عرض التقارير",
      description: "تقارير مفصلة عن المنصة",
      href: "/dashboard/analytics",
      icon: ChartBarIcon,
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      name: "إدارة التعليقات",
      description: "إصدار وإدارة التعليقات",
      href: "/dashboard/testimonials",
      icon: DocumentTextIcon,
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      name: "إعدادات النظام",
      description: "تكوين إعدادات المنصة",
      href: "/dashboard/settings",
      icon: Cog6ToothIcon,
      color: "bg-gray-500 hover:bg-gray-600",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        إجراءات سريعة
      </h2>
      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.name}
              href={action.href}
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
            >
              <div
                className={`flex-shrink-0 w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white transition-colors duration-200`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="mr-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                  {action.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
