"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useState } from "react";
import {
  HomeIcon,
  UserGroupIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  InboxIcon,
  UserPlusIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  InboxIcon as InboxIconSolid,
  UserPlusIcon as UserPlusIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
} from "@heroicons/react/24/solid";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import LoadingSpinner from "../ui/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { SparklesIcon } from "lucide-react";

const navigationItems = [
  {
    title: "الرئيسية",
    href: "/dashboard",
    icon: HomeIcon,
    activeIcon: HomeIconSolid,
  },
  {
    title: "العملاء المحتملين",
    href: "/dashboard/leads",
    icon: UserPlusIcon,
    activeIcon: UserPlusIconSolid,
  },
  // {
  //   title: "عملائي",
  //   href: "/dashboard/leads/my-leads",
  //   icon: InboxIcon,
  //   activeIcon: InboxIconSolid,
  // },
  {
    title: "البرامج",
    href: "/dashboard/courses",
    icon: BookOpenIcon,
    activeIcon: BookOpenIconSolid,
  },
  {
    title: "الإعدادات",
    href: "/dashboard/settings",
    icon: Cog6ToothIcon,
    activeIcon: Cog6ToothIconSolid,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { state, isMobile } = useSidebar();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <Sidebar side="right" collapsible="icon">
      {/* Header */}
      <SidebarHeader className="border-b border-gray-200/50 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
        <div className="flex items-center gap-3">
          {(isMobile || state === "expanded") && (
            <motion.div
              layoutId="dashboard-branding"
              className="flex items-center gap-3 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div
                layoutId="branding-icon"
                className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg"
              >
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                  />
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
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 px-3 mb-2 group-data-[collapsible=icon]:hidden">
            القائمة الرئيسية
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = isActive ? item.activeIcon : item.icon;
                if (
                  user?.role === UserRole.ADMIN &&
                  item.href === "/dashboard/leads/my-leads"
                ) {
                  return null;
                }
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`
                        relative rounded-lg transition-all duration-200
                        ${isActive
                          ? "bg-blue-50 text-blue-700 border-e-2 border-blue-600"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }
                      `}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2.5"
                      >
                        <Icon
                          className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-blue-600" : "text-gray-500"
                            }`}
                        />
                        <span className="font-medium text-sm truncate group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-gray-200/50 bg-gradient-to-br from-gray-50/50 to-blue-50/50">
        <div className="p-3 space-y-3">
          {/* User Info */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm group-data-[collapsible=icon]:justify-center">
            <div className="relative flex-shrink-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-bold">
                  {user?.name?.charAt(0) || "A"}
                </span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
            </div>
            <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name || "المسؤول"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.phone}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group-data-[collapsible=icon]:px-2"
          >
            {isLoggingOut ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">
                  تسجيل الخروج
                </span>
              </>
            )}
          </button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
