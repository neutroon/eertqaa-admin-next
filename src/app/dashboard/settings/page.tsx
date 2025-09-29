"use client";

import { useState } from "react";
import {
  Cog6ToothIcon,
  UserIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  KeyIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import ComingSoonOverlay from "@/components/common/ComingSoonOverlay";

export default function SettingsPage() {
  const [showComingSoon, setShowComingSoon] = useState(true);
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", name: "عام", icon: Cog6ToothIcon },
    { id: "users", name: "المستخدمين", icon: UserIcon },
    { id: "security", name: "الأمان", icon: ShieldCheckIcon },
    { id: "notifications", name: "الإشعارات", icon: BellIcon },
    { id: "platform", name: "المنصة", icon: GlobeAltIcon },
    { id: "reports", name: "التقارير", icon: DocumentTextIcon },
    { id: "api", name: "API", icon: KeyIcon },
    { id: "analytics", name: "التحليلات", icon: ChartBarIcon },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
              <p className="text-gray-600 mt-1">إدارة إعدادات النظام والمنصة</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                إعادة تعيين
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-5 h-5 ml-3" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {activeTab === "general" && <GeneralSettings />}
              {activeTab === "users" && <UserSettings />}
              {activeTab === "security" && <SecuritySettings />}
              {activeTab === "notifications" && <NotificationSettings />}
              {activeTab === "platform" && <PlatformSettings />}
              {activeTab === "reports" && <ReportSettings />}
              {activeTab === "api" && <ApiSettings />}
              {activeTab === "analytics" && <AnalyticsSettings />}
            </div>
          </div>
        </div>

        {/* Coming Soon Overlay */}
        <ComingSoonOverlay
          isOpen={showComingSoon}
          onClose={() => setShowComingSoon(false)}
          title="الإعدادات"
          description="صفحة الإعدادات قيد التطوير. ستتمكن من تخصيص إعدادات المنصة قريباً."
          expectedDate="👀"
        />
      </div>
    </>
  );
}

// General Settings Component
function GeneralSettings() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        الإعدادات العامة
      </h2>

      <div className="space-y-6">
        {/* Platform Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم المنصة
            </label>
            <input
              type="text"
              defaultValue="إرتقاء"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وصف المنصة
            </label>
            <input
              type="text"
              defaultValue="منصة تعليمية متخصصة في البرامج المهنية"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم الهاتف
            </label>
            <input
              type="tel"
              defaultValue="info@eertqaa.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم الهاتف
            </label>
            <input
              type="tel"
              defaultValue="+20 10 123 4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Language & Timezone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اللغة الافتراضية
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المنطقة الزمنية
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="Africa/Cairo">القاهرة (GMT+2)</option>
              <option value="Asia/Riyadh">الرياض (GMT+3)</option>
              <option value="Asia/Dubai">دبي (GMT+4)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// User Settings Component
function UserSettings() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        إدارة المستخدمين
      </h2>

      <div className="space-y-6">
        {/* User Registration */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">
            إعدادات التسجيل
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  تفعيل التسجيل التلقائي
                </p>
                <p className="text-xs text-gray-500">
                  السماح للمستخدمين بالتسجيل تلقائياً
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  التحقق من البريد الإلكتروني
                </p>
                <p className="text-xs text-gray-500">
                  مطلوب التحقق من البريد الإلكتروني عند التسجيل
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* User Roles */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">
            أدوار المستخدمين
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">مدير النظام</p>
                <p className="text-xs text-gray-500">صلاحيات كاملة</p>
              </div>
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                1 مستخدم
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  مدير المحتوى
                </p>
                <p className="text-xs text-gray-500">إدارة البرامج والمحتوى</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                3 مستخدمين
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">مشرف</p>
                <p className="text-xs text-gray-500">
                  مراقبة المتدربين والتقارير
                </p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                5 مستخدمين
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Security Settings Component
function SecuritySettings() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        إعدادات الأمان
      </h2>

      <div className="space-y-6">
        {/* Password Policy */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">
            سياسة كلمة المرور
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  الحد الأدنى لطول كلمة المرور
                </p>
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="8">8 أحرف</option>
                <option value="10">10 أحرف</option>
                <option value="12" selected>
                  12 حرف
                </option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  مطلوب أحرف خاصة
                </p>
                <p className="text-xs text-gray-500">!@#$%^&*</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Session Settings */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">
            إعدادات الجلسة
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  مدة انتهاء الجلسة (دقيقة)
                </p>
              </div>
              <input
                type="number"
                defaultValue="30"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  تسجيل خروج تلقائي عند عدم النشاط
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Notification Settings Component
function NotificationSettings() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        إعدادات الإشعارات
      </h2>

      <div className="space-y-6">
        {/* Phone Notifications */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">
            إشعارات رقم الهاتف
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  إشعارات التسجيل الجديد
                </p>
                <p className="text-xs text-gray-500">عند تسجيل متدرب جديد</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  تذكير بمواعيد البرامج
                </p>
                <p className="text-xs text-gray-500">
                  تذكير المتدربين بمواعيد البرامج
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* System Notifications */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">
            إشعارات النظام
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  تنبيهات الأمان
                </p>
                <p className="text-xs text-gray-500">
                  محاولات تسجيل دخول مشبوهة
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Platform Settings Component
function PlatformSettings() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        إعدادات المنصة
      </h2>

      <div className="space-y-6">
        {/* Course Settings */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">
            إعدادات البرامج
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  الحد الأقصى للطلاب في البرنامج
                </p>
              </div>
              <input
                type="number"
                defaultValue="50"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  تفعيل التسجيل المسبق
                </p>
                <p className="text-xs text-gray-500">
                  السماح بالتسجيل قبل بدء البرنامج
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Certificate Settings */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">
            إعدادات الشهادات
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  تفعيل الشهادات التلقائية
                </p>
                <p className="text-xs text-gray-500">
                  إصدار شهادات تلقائياً عند إكمال البرنامج
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Report Settings Component
function ReportSettings() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        إعدادات التقارير
      </h2>

      <div className="space-y-6">
        {/* Report Generation */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">
            توليد التقارير
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  توليد تقارير يومية
                </p>
                <p className="text-xs text-gray-500">تقارير إحصائية يومية</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  توليد تقارير شهرية
                </p>
                <p className="text-xs text-gray-500">تقارير شاملة شهرية</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Export Settings */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">
            إعدادات التصدير
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تنسيق التصدير الافتراضي
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// API Settings Component
function ApiSettings() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">إعدادات API</h2>

      <div className="space-y-6">
        {/* API Keys */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">مفاتيح API</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  مفتاح API الرئيسي
                </span>
                <button className="text-xs text-blue-600 hover:text-blue-800">
                  تجديد
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="password"
                  value="sk_live_51H...xyz"
                  readOnly
                  className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg"
                />
                <button className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                  نسخ
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Limiting */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">
            حدود الطلبات
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  الحد الأقصى للطلبات في الدقيقة
                </p>
              </div>
              <input
                type="number"
                defaultValue="100"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Analytics Settings Component
function AnalyticsSettings() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        إعدادات التحليلات
      </h2>

      <div className="space-y-6">
        {/* Google Analytics */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">
            Google Analytics
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                معرف التتبع
              </label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  تفعيل Google Analytics
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Data Retention */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">
            احتفاظ البيانات
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  فترة احتفاظ البيانات (شهر)
                </p>
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="6">6 أشهر</option>
                <option value="12" selected>
                  12 شهر
                </option>
                <option value="24">24 شهر</option>
                <option value="36">36 شهر</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
