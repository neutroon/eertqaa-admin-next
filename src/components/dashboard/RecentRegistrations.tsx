"use client";

import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Lead } from "@/config/api";

interface RecentRegistrationsProps {
  total: number;
  leads: Lead[];
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  contacted: "bg-blue-100 text-blue-800",
  converted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusLabels = {
  pending: "في الانتظار",
  contacted: "تم التواصل",
  converted: "تم الحجز",
  rejected: "غير مهتم",
};

export default function RecentRegistrations({ leads, total }: RecentRegistrationsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">أحدث العملاء</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {total === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            لا توجد عملاء حتى الآن
          </div>
        ) : (
          leads.map((lead) => (
            <div key={lead.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-medium">
                          {lead.name.split(" ")[0].charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="mr-3">
                      <p className="text-sm font-medium text-gray-900">
                        {lead.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {lead?.selectedProgram?.name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[lead.status]
                      }`}
                  >
                    {statusLabels[lead.status]}
                  </span>
                  <span className="text-sm text-gray-500">
                    {format(new Date(lead.createdAt), "dd MMM", { locale: ar })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="px-6 py-3 bg-gray-50 rounded-b-lg">
        <a
          href="/dashboard/leads"
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          عرض جميع العملاء →
        </a>
      </div>
    </div>
  );
}
