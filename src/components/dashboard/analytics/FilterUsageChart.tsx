"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface FilterUsageChartProps {
  data: Array<{
    filter: string;
    usageCount: number;
  }>;
}

export default function FilterUsageChart({ data }: FilterUsageChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          استخدام فلاتر الفئات
        </h3>
        <p className="text-sm text-gray-500">عدد مرات استخدام كل فلتر للفئات</p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="filter"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "#6B7280" }}
            />
            <YAxis tick={{ fontSize: 12 }} tickLine={{ stroke: "#6B7280" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              labelStyle={{ color: "#374151", fontWeight: "bold" }}
              formatter={(value: number) => [value, "استخدام"]}
              labelFormatter={(label) => `الفلتر: ${label}`}
            />
            <Bar dataKey="usageCount" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
