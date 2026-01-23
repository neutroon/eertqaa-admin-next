"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { useLeads, useLeadsStats } from "@/hooks/useLeads";
import LeadsManagement from "@/components/dashboard/leads/LeadsManagement";
import { QueryObserverResult } from "@tanstack/react-query";
import { LeadsResponse } from "@/config/api";

export default function LeadsPage() {
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
    // Reset to page 1 if any filter other than page changes
    if (!updates.page) {
      params.set("page", "1");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });

    return { params, pathname, router };
  };

  const handleRefresh = () => {
    refetch();
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            {error instanceof Error
              ? error.message
              : "فشل في تحميل العملاء المحتملين"}
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                العملاء المحتملين
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                نظام الاستلام المباشر للعملاء المحتملين
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-lg border border-orange-200">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-orange-700">
                  {statsData?.unclaimedLeads || 0} متاح للاستلام
                </span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-700">
                  {statsData?.totalLeads || 0} إجمالي
                </span>
              </div>

              <button
                onClick={handleRefresh}
                disabled={isRefetching}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-50"
                title="تحديث"
              >
                <ArrowPathIcon
                  className={cn("h-5 w-5", isRefetching && "animate-spin")}
                />
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  كيف يعمل نظام الاستلام المباشر؟
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  العملاء المحتملون المتاحون يظهرون بعلامة{" "}
                  <span className="inline-flex items-center mx-1 px-2 py-0.5 rounded-full bg-red-500 border text-white border-gray-200 text-[8px] font-semibold">
                    <span className="w-1 h-1 bg-white rounded-full ml-1"></span>
                    متاح الآن
                  </span>{" "}
                  ويمكن لأي موظف مبيعات استلامها. بمجرد الاستلام، يتم تخصيص
                  العميل لك تلقائياً ولا يمكن لأحد آخر الوصول إليه.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LeadsManagement
        isFetching={isFetching}
        leadsData={leadsData}
        onLeadCreated={() => refetch()}
        onLeadUpdated={() => refetch()}
        onLeadDeleted={() => refetch()}
        onRefresh={handleRefresh}
        filters={{ page, limit, status, isLocked, search, sortOrder, leadId }}
        onFilterChange={updateFilters}
        stats={statsData}
        pageSize={limit}
        onPageSizeChange={(size: number) =>
          updateFilters({ limit: size, page: 1 })
        }
        leadProfile={leadProfile}
        leadProfileLoading={leadProfileLoading}
        refetchLeadProfile={refetchLeadProfile}
      >
        {leadsData.leads.length > 0 && (
          <div className="relative bg-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200">
            <nav
              className="flex items-center gap-2"
              aria-label="Pagination"
              dir="ltr"
            >
              <button
                onClick={() => updateFilters({ page: Math.max(1, page - 1) })}
                disabled={page === 1}
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl border text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm disabled:opacity-40"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200">
                <span className="px-4 text-xs font-bold text-gray-600">
                  {page} / {leadsData.totalPages}
                </span>
              </div>

              <button
                onClick={() =>
                  updateFilters({
                    page: Math.min(leadsData.totalPages, page + 1),
                  })
                }
                disabled={page === leadsData.totalPages}
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm disabled:opacity-40"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </nav>
          </div>
        )}
      </LeadsManagement>

      {/* Pagination Summary */}
      {leadsData.leads.length > 0 && (
        <div className="bg-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            عرض{" "}
            <span className="font-medium text-gray-900">
              {(page - 1) * limit + 1}
            </span>{" "}
            إلى{" "}
            <span className="font-medium text-gray-900">
              {Math.min(page * limit, leadsData.total)}
            </span>{" "}
            من{" "}
            <span className="font-medium text-gray-900">{leadsData.total}</span>{" "}
            نتائج
          </p>
        </div>
      )}
    </div>
  );
}
