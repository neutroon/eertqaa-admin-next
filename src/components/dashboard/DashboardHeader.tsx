"use client";

import {
  BellIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { open } = useSidebar();

  // Detect scroll for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50"
        : "bg-white/95 backdrop-blur-md shadow-md"
        }`}
    >
      <div className="max-w-[98%] mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SidebarTrigger className="h-10 w-10 text-gray-600 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all" />
            </motion.div>

            {!open && (
              <motion.div
                layoutId="dashboard-branding"
                className="flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <motion.div
                  layoutId="branding-icon"
                  className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg"
                >
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </motion.div>
                <motion.div layoutId="branding-text">
                  <h5 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    لوحة التحكم
                  </h5>
                  <p className="text-xs text-gray-500 font-medium">
                    منصة إرتقاء التعليمية
                  </p>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Right Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3"
          >
            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2.5 text-gray-600 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all group"
            >
              <BellIcon className="w-6 h-6 group-hover:text-blue-600 transition-colors" />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute top-1.5 right-1.5 block w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full ring-2 ring-white"
              />
            </motion.button>

            {/* User Profile */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all group"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {user?.name || "المدير"}
                  </p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"
                  />
                </div>
                <motion.div
                  animate={{ rotate: showUserMenu ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                </motion.div>
              </motion.button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-50"
                  >
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-b border-gray-200/50">
                      <p className="text-sm font-bold text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">{user?.phone}</p>
                    </div>
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={async () => {
                        setShowUserMenu(false);
                        await logout();
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-600 font-medium transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5 ml-2" />
                      تسجيل الخروج
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
