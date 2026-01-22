"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon, ArrowPathIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { useLeads, useLeadsStats } from "@/hooks/useLeads";
import LeadsManagement from "@/components/dashboard/leads/LeadsManagement";
import { useAuth } from "@/contexts/AuthContext";

export default function MyLeadsPage() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const status = searchParams.get("status") || undefined;
    const isLocked = searchParams.get("isLocked") || undefined;
    const search = searchParams.get("search") || "";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
    const leadId = searchParams.get("leadId") || undefined;

    const leadsResult = useLeads({
        page,
        limit,
        status,
        isLocked,
        search,
        "orderBy.createdAt": sortOrder,
        id: leadId,
        assignedToSalesId: user?.id,
    });

    const {
        data: leadsData,
        isLoading,
        isFetching,
        isRefetching,
        error,
        refetch,
        leadProfile,
        leadProfileLoading,
        refetchLeadProfile,
    } = leadsResult;

    const { data: statsData } = useLeadsStats();

    const updateFilters = (
        updates: Record<string, string | number | undefined>
    ) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === undefined || value === "") {
                params.delete(key);
            } else {
                params.set(key, value.toString());
            }
        });
        if (!updates.page) {
            params.set("page", "1");
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleRefresh = () => {
        refetch();
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-red-600 mb-4 font-bold">
                        {error instanceof Error ? error.message : "فشل في تحميل عملائك"}
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    if (!leadsData) return null;

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100 rotate-3">
                                <UserGroupIcon className="w-8 h-8 text-white -rotate-3" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                    عملائي
                                </h1>
                                <p className="text-base text-gray-500 mt-1 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    إدارة ومتابعة العملاء المخصصين لك
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 flex flex-col items-center min-w-[100px]">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">الإجمالي</span>
                                <span className="text-xl font-black text-gray-900">{leadsData.total}</span>
                            </div>

                            <button
                                onClick={handleRefresh}
                                disabled={isRefetching}
                                className="p-4 rounded-2xl bg-white border border-gray-200 text-gray-600 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm disabled:opacity-50"
                                title="تحديث"
                            >
                                <ArrowPathIcon className={cn("h-6 w-6", isRefetching && "animate-spin")} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pb-12">
                <LeadsManagement
                    leadsData={leadsData}
                    onLeadCreated={() => refetch()}
                    onLeadUpdated={() => refetch()}
                    onLeadDeleted={() => refetch()}
                    onRefresh={handleRefresh}
                    filters={{ page, limit, status, isLocked, search, sortOrder, leadId }}
                    onFilterChange={updateFilters}
                    stats={statsData}
                    pageSize={limit}
                    onPageSizeChange={(size: number) => updateFilters({ limit: size, page: 1 })}
                    leadProfile={leadProfile}
                    leadProfileLoading={leadProfileLoading}
                    refetchLeadProfile={refetchLeadProfile}
                >
                    {leadsData.leads.length > 0 && (
                        <div className="flex items-center gap-2" dir="ltr">
                            <button
                                onClick={() => updateFilters({ page: Math.max(1, page - 1) })}
                                disabled={page === 1}
                                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-indigo-600 hover:text-indigo-600 transition-all disabled:opacity-40"
                            >
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>

                            <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm font-bold text-gray-600">
                                {page} / {leadsData.totalPages}
                            </div>

                            <button
                                onClick={() => updateFilters({ page: Math.min(leadsData.totalPages, page + 1) })}
                                disabled={page === leadsData.totalPages}
                                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-indigo-600 hover:text-indigo-600 transition-all disabled:opacity-40"
                            >
                                <ChevronRightIcon className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </LeadsManagement>

                {/* Floating Empty State if needed */}
                {leadsData.leads.length === 0 && !isLoading && (
                    <div className="py-20 flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <UserGroupIcon className="w-12 h-12 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">لا يوجد عملاء مخصصين حالياً</h3>
                        <p className="text-gray-500 max-w-xs">بمجرد استلامك لعملاء جدد من القائمة العامة، سيظهرون هنا للمتابعة.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
