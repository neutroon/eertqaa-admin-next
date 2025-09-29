"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "lucide-react";

const navigation = [
  { name: "الرئيسية", href: "/dashboard", icon: HomeIcon },
  { name: "إدارة البرامج", href: "/dashboard/courses", icon: BookOpenIcon },
  // { name: "إدارة المتدربين", href: "/dashboard/students", icon: UserGroupIcon },
  { name: "العملاء المحتملين", href: "/dashboard/leads", icon: UsersIcon },
  // {
  //   name: "التقارير والتحليلات",
  //   href: "/dashboard/analytics",
  //   icon: ChartBarIcon,
  // },
  {
    name: "إدارة التعليقات",
    href: "/dashboard/testimonials",
    icon: ChatBubbleLeftRightIcon,
  },
  { name: "الإعدادات", href: "/dashboard/settings", icon: Cog6ToothIcon },
];

const stats = [
  {
    label: "إجمالي البرامج",
    value: "30",
    change: "+2",
    changeType: "positive",
  },
  {
    label: "المتدربين المسجلين",
    value: "1,247",
    change: "+12%",
    changeType: "positive",
  },
  {
    label: "التعليقات الممنوحة",
    value: "892",
    change: "+8%",
    changeType: "positive",
  },
  { label: "معدل الرضا", value: "94%", change: "+3%", changeType: "positive" },
];

export default function ResponsiveSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useAuth();
  // Close sidebar on mobile when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } lg:static lg:inset-0 lg:flex lg:flex-col lg:w-80 lg:shadow-none lg:border-l lg:border-gray-200`}
      >
        <div className="sticky top-0 bottom-0">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">إ</span>
                </div>
              </div>
              {!collapsed && (
                <div className="mr-3">
                  <h1 className="text-xl font-bold text-gray-900">إرتقاء</h1>
                  <p className="text-xs text-gray-500">لوحة التحكم</p>
                </div>
              )}
            </div>

            {/* Collapse button - desktop only */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {collapsed ? (
                <ChevronLeftIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRightIcon className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {/* Close button - mobile only */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Search bar */}
          {!collapsed && (
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث..."
                  className="w-full pr-10 pl-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto sidebar-scroll">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      isActive
                        ? "text-blue-700"
                        : "text-gray-400 group-hover:text-gray-500"
                    } ${collapsed ? "ml-0" : "ml-3"}`}
                  />
                  {!collapsed && (
                    <span className="mr-3 truncate">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Stats section */}
          {!collapsed && (
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                إحصائيات سريعة
              </h3>
              <div className="space-y-3">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-gray-600">{stat.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {stat.value}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          stat.changeType === "positive"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User section */}
          <div className="p-4 border-t border-gray-200">
            <div
              className={`flex items-center ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              {!collapsed && (
                <>
                  <div className="mr-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.name || "المدير"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.phone || "admin@eertqaa.com"}
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      setIsLoading(true);
                      await logout();
                      setIsLoading(false);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {isLoading ? (
                      <Loader className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ArrowRightOnRectangleIcon className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-40 p-3 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
      >
        <Bars3Icon className="w-6 h-6 text-gray-600" />
      </button>
    </>
  );
}
