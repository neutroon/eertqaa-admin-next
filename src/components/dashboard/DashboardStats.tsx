"use client";

import {
  BookOpenIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const stats = [
  {
    name: "إجمالي البرامج",
    value: "30",
    change: "+2",
    changeType: "positive",
    icon: BookOpenIcon,
    color: "bg-blue-500",
  },
  {
    name: "إجمالي المتدربين",
    value: "1,234",
    change: "+12%",
    changeType: "positive",
    icon: UserGroupIcon,
    color: "bg-green-500",
  },
  {
    name: "التسجيلات الجديدة",
    value: "89",
    change: "+5",
    changeType: "positive",
    icon: ClipboardDocumentListIcon,
    color: "bg-yellow-500",
  },
  {
    name: "معدل الإكمال",
    value: "87%",
    change: "+3%",
    changeType: "positive",
    icon: ChartBarIcon,
    color: "bg-purple-500",
  },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
          <div className="mt-4">
            <span
              className={`text-sm font-medium ${
                stat.changeType === "positive"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {stat.change}
            </span>
            <span className="text-sm text-gray-500 mr-2">من الشهر الماضي</span>
          </div>
        </div>
      ))}
    </div>
  );
}
