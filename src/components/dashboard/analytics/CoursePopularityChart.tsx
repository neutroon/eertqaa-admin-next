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

interface CoursePopularityChartProps {
  data: Array<{
    courseId: string;
    courseName: string;
    views: number;
    enrollments: number;
  }>;
}

export default function CoursePopularityChart({
  data,
}: CoursePopularityChartProps) {
  const chartData = data.map((course) => ({
    ...course,
    conversionRate: ((course.enrollments / course.views) * 100).toFixed(1),
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">شعبية البرامج</h3>
        <p className="text-sm text-gray-500">
          عدد المشاهدات والتسجيلات لكل برنامج
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="courseName"
              tick={{ fontSize: 10 }}
              tickLine={{ stroke: "#6B7280" }}
              angle={-45}
              textAnchor="end"
              height={100}
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
              formatter={(value: number, name: string) => [
                value,
                name === "views" ? "مشاهدة" : "تسجيل",
              ]}
              labelFormatter={(label) => `البرنامج: ${label}`}
            />
            <Bar
              dataKey="views"
              fill="#3B82F6"
              name="views"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="enrollments"
              fill="#10B981"
              name="enrollments"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
