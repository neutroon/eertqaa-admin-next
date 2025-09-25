"use client";

import { format } from "date-fns";

const recentRegistrations = [
  {
    id: "1",
    name: "أحمد محمد علي",
    course: "تطوير الويب المتقدم",
    date: new Date("2024-01-15"),
    status: "pending",
    phone: "01024354212",
  },
  {
    id: "2",
    name: "فاطمة أحمد حسن",
    course: "إدارة المشاريع",
    date: new Date("2024-01-14"),
    status: "approved",
    phone: "01024354212",
  },
  {
    id: "3",
    name: "محمد عبدالله",
    course: "التسويق الرقمي",
    date: new Date("2024-01-13"),
    status: "enrolled",
    phone: "01024354212",
  },
  {
    id: "4",
    name: "نورا سعد الدين",
    course: "الذكاء الاصطناعي",
    date: new Date("2024-01-12"),
    status: "completed",
    phone: "01024354212",
  },
  {
    id: "5",
    name: "خالد إبراهيم",
    course: "البرمجة بلغة Python",
    date: new Date("2024-01-11"),
    status: "pending",
    phone: "01024354212",
  },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  enrolled: "bg-green-100 text-green-800",
  completed: "bg-purple-100 text-purple-800",
};

const statusLabels = {
  pending: "في الانتظار",
  approved: "موافق عليه",
  enrolled: "مسجل",
  completed: "مكتمل",
};

export default function RecentRegistrations() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">آخر التسجيلات</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {recentRegistrations.map((registration) => (
          <div key={registration.id} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-medium">
                        {registration.name.split(" ")[0].charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="mr-3">
                    <p className="text-sm font-medium text-gray-900">
                      {registration.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {registration.course}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    statusColors[
                      registration.status as keyof typeof statusColors
                    ]
                  }`}
                >
                  {
                    statusLabels[
                      registration.status as keyof typeof statusLabels
                    ]
                  }
                </span>
                <span className="text-sm text-gray-500">
                  {format(registration.date, "dd MMM")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-3 bg-gray-50 rounded-b-lg">
        <a
          href="/dashboard/students"
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          عرض جميع التسجيلات →
        </a>
      </div>
    </div>
  );
}
