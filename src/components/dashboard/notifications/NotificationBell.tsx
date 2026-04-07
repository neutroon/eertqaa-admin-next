"use client";

import { useState, useRef, useEffect } from "react";
import { 
  BellIcon, 
  CheckCircleIcon,
  ArchiveBoxIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useInfiniteNotifications, useMarkAllAsRead, useMarkAsRead } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import Link from "next/link";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteNotifications(10);
  
  const markAllAsRead = useMarkAllAsRead();
  const markAsRead = useMarkAsRead();

  // Extract notifications from all pages
  const notifications = data?.pages.flatMap((page) => page.notifications) || [];
  const unreadCount = data?.pages[0]?.unreadCount || 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-gray-600 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all group"
      >
        <BellIcon className={`w-6 h-6 group-hover:text-blue-600 transition-colors ${isOpen ? 'text-blue-600' : ''}`} />
        
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full ring-2 ring-white"
          >
            {unreadCount > 9 ? "+9" : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 mt-3 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-50 origin-top-left"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-br from-blue-50/50 to-purple-50/50">
              <div>
                <h3 className="text-sm font-bold text-gray-900">التنبيهات</h3>
                <p className="text-xs text-gray-500">لديك {unreadCount} تنبيه غير مقروء</p>
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  disabled={markAllAsRead.isPending}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  قراء الكل
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
                  <p className="text-xs text-gray-500 mt-2">جاري التحميل...</p>
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 transition-colors hover:bg-gray-50 cursor-pointer relative group ${!notification.isRead ? 'bg-blue-50/20' : ''}`}
                      onClick={() => !notification.isRead && markAsRead.mutate(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!notification.isRead ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]' : 'bg-transparent'}`} />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-bold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </p>
                            <span className="text-[10px] text-gray-400 font-medium">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: ar })}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {notification.message}
                          </p>
                          
                          {notification.type === 'FOLLOW_UP' && notification.data?.leadId && (
                            <Link 
                              href={`/dashboard/leads?leadId=${notification.data.leadId}`}
                              className="inline-flex items-center mt-2 px-2 py-1 rounded-md bg-blue-100 text-[10px] font-bold text-blue-700 hover:bg-blue-200 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                               عرض الملف الشخصي
                            </Link>
                          )}
                        </div>
                      </div>
                      
                      {!notification.isRead && (
                        <button
                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="تحديد كمقروء"
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="h-12 w-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <ArchiveBoxIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-bold text-gray-900">لا توجد تنبيهات</p>
                  <p className="text-xs text-gray-500 mt-1">ستظهر هنا الإشعارات الجديدة فور وصولها</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-gray-50/50 border-t border-gray-100 flex flex-col gap-2">
              {hasNextPage && (
                <button 
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="w-full py-2 text-[11px] font-bold text-blue-600 hover:bg-blue-100/50 rounded-xl transition-all disabled:opacity-50"
                >
                  {isFetchingNextPage ? "جاري التحميل..." : "تحميل المزيد"}
                </button>
              )}
              <Link 
                href="/dashboard/notifications" 
                onClick={() => setIsOpen(false)}
                className="w-full py-2 text-[11px] font-bold text-gray-500 hover:text-blue-600 transition-colors text-center"
              >
                عرض كل التنبيهات
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
