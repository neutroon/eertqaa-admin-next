"use client";

import { useEffect, useState } from "react";
import { userService, User, ListUsersResponse } from "@/services/users";
import { UsersTable } from "@/components/dashboard/users/UsersTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  UserPlus, 
  Search, 
  Filter, 
  Users as UsersIcon, 
  ShieldCheck, 
  Headphones,
  ArrowRight,
  ArrowLeft,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { UserRole } from "@/config/api";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<ListUsersResponse["pagination"] | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userService.listUsers({
        search,
        role: role === "ALL" ? undefined : role,
        page,
        limit: 10,
      });
      if (data) {
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("حدث خطأ أثناء تحميل المستخدمين");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, role]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await userService.toggleStatus(user.id);
      toast.success(`تم ${user.isActive ? "تعطيل" : "تفعيل"} حساب ${user.name} بنجاح`);
      fetchUsers();
    } catch (error) {
      toast.error("حدث خطأ أثناء تغيير حالة المستخدم");
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (confirm(`هل أنت متأكد من حذف المستخدم ${user.name}؟`)) {
      try {
        await userService.deleteUser(user.id);
        toast.success("تم حذف المستخدم بنجاح");
        fetchUsers();
      } catch (error) {
        toast.error("حدث خطأ أثناء حذف المستخدم");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-br from-blue-600 to-purple-700 p-6 md:p-8 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <UsersIcon className="h-8 w-8" />
            إدارة المستخدمين
          </h1>
          <p className="text-blue-100 font-medium">إدارة وصول المديرين ووكلاء المبيعات للمنصة</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            className="bg-white text-blue-700 hover:bg-blue-50 rounded-xl px-6 py-6 font-bold shadow-lg gap-2"
            onClick={() => window.location.href = "/dashboard/users/new"}
          >
            <UserPlus className="h-5 w-5" />
            إضافة مستخدم جديد
          </Button>
        </motion.div>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-200/50 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <UsersIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">إجمالي المستخدمين</p>
            <p className="text-2xl font-bold text-gray-900">{pagination?.total || 0}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200/50 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">المديرين</p>
            <p className="text-2xl font-bold text-gray-900">
              {users.filter(u => u.role === UserRole.ADMIN).length}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200/50 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
            <Headphones className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">وكلاء المبيعات</p>
            <p className="text-2xl font-bold text-gray-900">
              {users.filter(u => u.role === UserRole.SALES_AGENT).length}
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/50 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <form onSubmit={handleSearch} className="relative flex-1 w-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="ابحث بالاسم، الهاتف أو البريد الإلكتروني..." 
              className="pr-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button 
              variant="outline" 
              className={`h-11 rounded-xl px-4 gap-2 ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              تصفية
            </Button>
            <Button className="h-11 rounded-xl px-6 bg-blue-600 hover:bg-blue-700" onClick={handleSearch}>
              بحث
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                <button 
                  onClick={() => setRole("ALL")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    role === "ALL" ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  الكل
                </button>
                <button 
                  onClick={() => setRole(UserRole.ADMIN)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    role === UserRole.ADMIN ? "bg-purple-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  المديرين
                </button>
                <button 
                  onClick={() => setRole(UserRole.SALES_AGENT)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    role === UserRole.SALES_AGENT ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  وكلاء المبيعات
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Users Table */}
      <UsersTable 
        users={users} 
        isLoading={isLoading} 
        onEdit={(user) => window.location.href = `/dashboard/users/${user.id}/edit`}
        onDelete={handleDeleteUser}
        onToggleStatus={handleToggleStatus}
      />

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200/50 shadow-sm">
          <p className="text-sm text-gray-500">
            عرض صفحة <span className="font-semibold text-gray-900">{pagination.page}</span> من <span className="font-semibold text-gray-900">{pagination.pages}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-lg gap-2"
              disabled={pagination.page === 1}
              onClick={() => setPage(prev => prev - 1)}
            >
              <ArrowRight className="h-4 w-4" />
              السابق
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-lg gap-2"
              disabled={pagination.page === pagination.pages}
              onClick={() => setPage(prev => prev + 1)}
            >
              التالي
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
