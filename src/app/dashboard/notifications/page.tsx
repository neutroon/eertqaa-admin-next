"use client";

import { useState } from "react";
import { 
  useNotifications, 
  useMarkAllAsRead, 
  useMarkAsRead 
} from "@/hooks/useNotifications";
import { 
  BellIcon, 
  CheckCircleIcon,
  ArchiveBoxIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";
import { ar } from "ar-SA/locale"; // Use correct locale name if needed, or stick to 'ar'
import { ar as arLocale } from "date-fns/locale";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, isFetching, refetch } = useNotifications(page, limit);
  const markAllAsRead = useMarkAllAsRead();
  const markAsRead = useMarkAsRead();

  const notifications = data?.notifications || [];
  const totalPages = data?.totalPages || 1;
  const unreadCount = data?.unreadCount || 0;

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <BellIcon className="h-6 w-6 text-blue-600" />
            </div>
            التنبيهات
          </h1>
          <p className="text-sm text-gray-500 mt-1">إدارة جميع التنبيهات والإشعارات الخاصة بك</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
            title="تحديث"
          >
            <ArrowPathIcon className={cn("h-5 w-5", isFetching && "animate-spin")} />
          </button>
          
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
            >
              <CheckCircleIcon className="h-5 w-5" />
              تحديد الكل كمقروء
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center">
            <div className="animate-spin h-8 w-8 border-3 border-blue-600 border-t-transparent rounded-full mx-auto" />
            <p className="text-sm text-gray-500 mt-4 font-medium">جاري تحميل التنبيهات...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {notifications.map((notification) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={notification.id}
                className={cn(
                  "p-5 transition-all hover:bg-gray-50 flex gap-4 group relative",
                  !notification.isRead && "bg-blue-50/20"
                )}
                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
              >
                <div className={cn(
                  "mt-1.5 h-2.5 w-2.5 rounded-full flex-shrink-0",
                  !notification.isRead ? "bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]" : "bg-transparent"
                )} />
                
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className={cn(
                      "text-base font-bold",
                      !notification.isRead ? "text-gray-900" : "text-gray-700"
                    )}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-400 font-medium">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: arLocale })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
                    {notification.message}
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    {notification.type === 'FOLLOW_UP' && notification.data?.leadId && (
                      <Link 
                        href={`/dashboard/leads?id=${notification.data.leadId}`}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-100/50 text-[11px] font-bold text-blue-700 hover:bg-blue-100 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                         عرض الملف الشخصي للعميل
                      </Link>
                    )}
                  </div>
                </div>

                {!notification.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(notification.id);
                    }}
                    className="sm:opacity-0 sm:group-hover:opacity-100 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    title="تحديد كمقروء"
                  >
                    <CheckCircleIcon className="h-6 w-6" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-32 text-center">
            <div className="h-20 w-20 bg-gray-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
              <ArchiveBoxIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">لا توجد تنبيهات حالياً</h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
              عندما يتم إرسال تنبيهات جديدة لك، ستظهر جميعها في هذه الصفحة لتتمكن من متابعتها.
            </p>
          </div>
        )}

        {/* Pagination Footer */}
        {notifications.length > 0 && totalPages > 1 && (
          <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-center sm:justify-between gap-4" dir="ltr">
            <nav className="flex items-center gap-2" aria-label="Pagination">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm disabled:opacity-40"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              <div className="flex items-center bg-white rounded-xl px-4 h-10 border border-gray-200">
                <span className="text-xs font-bold text-gray-600">
                  {page} / {totalPages}
                </span>
              </div>

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm disabled:opacity-40"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </nav>
            
            <div className="hidden sm:block text-sm text-gray-400 font-medium" dir="rtl">
              عرض الصفحة {page} من أصل {totalPages}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
