import AppSidebar from "@/components/dashboard/AppSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider defaultOpen={false}>
        <AnimatePresence mode="wait">
          <AppSidebar />
          <SidebarInset className="w-[calc(100%-var(--sidebar-width))]">
            <DashboardHeader />
            <main className="p-4 lg:p-6">{children}</main>
          </SidebarInset>
        </AnimatePresence>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
