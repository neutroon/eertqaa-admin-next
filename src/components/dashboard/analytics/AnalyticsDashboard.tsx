"use client";

import { useState } from "react";
import {
  ChartBarIcon,
  EyeIcon,
  UserGroupIcon,
  BookOpenIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import MonthlyRegistrationsChart from "./MonthlyRegistrationsChart";
import CategoryPopularityChart from "./CategoryPopularityChart";
import CoursePopularityChart from "./CoursePopularityChart";
import FilterUsageChart from "./FilterUsageChart";

const analyticsData = {
  totalCourses: 30,
  totalStudents: 1234,
  totalRegistrations: 1567,
  activeCourses: 28,
  completedCourses: 15,
  monthlyRegistrations: [
    { month: "يناير", count: 120 },
    { month: "فبراير", count: 145 },
    { month: "مارس", count: 98 },
    { month: "أبريل", count: 167 },
    { month: "مايو", count: 189 },
    { month: "يونيو", count: 203 },
    { month: "يوليو", count: 178 },
    { month: "أغسطس", count: 156 },
    { month: "سبتمبر", count: 134 },
    { month: "أكتوبر", count: 198 },
    { month: "نوفمبر", count: 167 },
    { month: "ديسمبر", count: 142 },
  ],
  popularCategories: [
    { category: "التكنولوجيا", count: 456, percentage: 35.2 },
    { category: "الإدارة", count: 234, percentage: 18.1 },
    { category: "التسويق", count: 198, percentage: 15.3 },
    { category: "المالية", count: 156, percentage: 12.1 },
    { category: "التصميم", count: 134, percentage: 10.4 },
    { category: "اللغات", count: 89, percentage: 6.9 },
    { category: "الصحة", count: 67, percentage: 5.2 },
    { category: "العلوم", count: 45, percentage: 3.5 },
    { category: "الطب", count: 23, percentage: 1.8 },
  ],
  coursePopularity: [
    {
      courseId: "1",
      courseName: "تطوير الويب المتقدم",
      views: 1250,
      enrollments: 156,
    },
    {
      courseId: "2",
      courseName: "إدارة المشاريع",
      views: 1100,
      enrollments: 134,
    },
    {
      courseId: "3",
      courseName: "التسويق الرقمي",
      views: 980,
      enrollments: 128,
    },
    {
      courseId: "4",
      courseName: "الذكاء الاصطناعي",
      views: 1150,
      enrollments: 112,
    },
    {
      courseId: "5",
      courseName: "البرمجة بلغة Python",
      views: 890,
      enrollments: 98,
    },
    {
      courseId: "6",
      courseName: "التصميم الجرافيكي",
      views: 750,
      enrollments: 87,
    },
    {
      courseId: "7",
      courseName: "التحليل المالي",
      views: 680,
      enrollments: 76,
    },
    {
      courseId: "8",
      courseName: "اللغة الإنجليزية",
      views: 620,
      enrollments: 65,
    },
  ],
  filterUsage: [
    { filter: "التكنولوجيا", usageCount: 456 },
    { filter: "الإدارة", usageCount: 234 },
    { filter: "التسويق", usageCount: 198 },
    { filter: "المالية", usageCount: 156 },
    { filter: "التصميم", usageCount: 134 },
    { filter: "اللغات", usageCount: 89 },
    { filter: "الصحة", usageCount: 67 },
    { filter: "العلوم", usageCount: 45 },
    { filter: "الطب", usageCount: 23 },
  ],
};

const overviewCards = [
  {
    title: "إجمالي البرامج",
    value: analyticsData.totalCourses,
    icon: BookOpenIcon,
    color: "bg-blue-500",
    change: "+2",
    changeType: "positive",
  },
  {
    title: "إجمالي المتدربين",
    value: analyticsData.totalStudents.toLocaleString(),
    icon: UserGroupIcon,
    color: "bg-green-500",
    change: "+12%",
    changeType: "positive",
  },
  {
    title: "إجمالي التسجيلات",
    value: analyticsData.totalRegistrations.toLocaleString(),
    icon: ChartBarIcon,
    color: "bg-purple-500",
    change: "+8%",
    changeType: "positive",
  },
  {
    title: "البرامج النشطة",
    value: analyticsData.activeCourses,
    icon: EyeIcon,
    color: "bg-yellow-500",
    change: "+1",
    changeType: "positive",
  },
];

export default function AnalyticsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("year");
  const [selectedChart, setSelectedChart] = useState("registrations");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            التحليلات والإحصائيات
          </h2>
          <p className="text-gray-600">تحليل أداء المنصة وسلوك المستخدمين</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">الأسبوع</option>
            <option value="month">الشهر</option>
            <option value="quarter">الربع</option>
            <option value="year">السنة</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <span
                className={`text-sm font-medium ${
                  card.changeType === "positive"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {card.change}
              </span>
              <span className="text-sm text-gray-500 mr-2">
                من الفترة السابقة
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Navigation */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex space-x-1">
          {[
            {
              id: "registrations",
              label: "التسجيلات الشهرية",
              icon: ChartBarIcon,
            },
            { id: "categories", label: "شعبية الفئات", icon: FunnelIcon },
            { id: "courses", label: "شعبية البرامج", icon: BookOpenIcon },
            { id: "filters", label: "استخدام الفلاتر", icon: EyeIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedChart(tab.id)}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedChart === tab.id
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <tab.icon className="w-4 h-4 ml-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedChart === "registrations" && (
          <div className="lg:col-span-2">
            <MonthlyRegistrationsChart
              data={analyticsData.monthlyRegistrations}
            />
          </div>
        )}

        {selectedChart === "categories" && (
          <div className="lg:col-span-2">
            <CategoryPopularityChart data={analyticsData.popularCategories} />
          </div>
        )}

        {selectedChart === "courses" && (
          <div className="lg:col-span-2">
            <CoursePopularityChart data={analyticsData.coursePopularity} />
          </div>
        )}

        {selectedChart === "filters" && (
          <div className="lg:col-span-2">
            <FilterUsageChart data={analyticsData.filterUsage} />
          </div>
        )}
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Courses */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              أفضل البرامج أداءً
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsData.coursePopularity
                .slice(0, 5)
                .map((course, index) => (
                  <div
                    key={course.courseId}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center ml-3">
                        <span className="text-blue-600 text-sm font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {course.courseName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {course.enrollments} تسجيل
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {course.views} مشاهدة
                      </p>
                      <p className="text-xs text-gray-500">
                        {((course.enrollments / course.views) * 100).toFixed(1)}
                        % تحويل
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">أداء الفئات</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsData.popularCategories
                .slice(0, 5)
                .map((category, index) => (
                  <div
                    key={category.category}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center ml-3">
                        <span className="text-green-600 text-sm font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {category.category}
                        </p>
                        <p className="text-xs text-gray-500">
                          {category.count} تسجيل
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {category.percentage}%
                      </p>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
