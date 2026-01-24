"use client";
import AppSidebar from "@/components/dashboard/AppSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import OnlineUsersWidget from "@/components/dashboard/OnlineUsersWidget";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AnimatePresence } from "framer-motion";
import { SocketProvider } from "@/components/providers/SocketProvider";
import { useAuth } from "@/contexts/AuthContext";
// import { OnlineUser } from "@/types/user";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  return (
    <ProtectedRoute>
      <SocketProvider>
        <OnlineUsersWidget user={user as any} />
        <SidebarProvider defaultOpen={false}>
          <AnimatePresence mode="wait">
            <AppSidebar />
            <SidebarInset className="w-[calc(100%-var(--sidebar-width))]">
              <DashboardHeader />
              <main className="p-4 lg:p-6">{children}</main>
            </SidebarInset>
          </AnimatePresence>
        </SidebarProvider>
      </SocketProvider>
    </ProtectedRoute>
  );
}
