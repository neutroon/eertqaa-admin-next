import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { leadsService } from "@/services/leads";
import { Lead, LeadsResponse } from "@/config/api";
import page from "@/app/page";

export function useLeads(params?: {
  page?: number;
  limit?: number;
  status?: string;
  isLocked?: string;
  search?: string;
  "orderBy.createdAt"?: "asc" | "desc";
  id?: string;
  assignedToSalesId?: string;
}) {
  const query = useQuery({
    queryKey: ["leads", params],
    queryFn: () =>
      leadsService.getAllLeads({
        page: params?.page,
        limit: params?.limit,
        status: params?.status,
        isLocked: params?.isLocked,
        search: params?.search,
        assignedToSalesId: params?.assignedToSalesId,
        "orderBy.createdAt": params?.["orderBy.createdAt"],
      }), // Large batch for client-side management
    // placeholderData: keepPreviousData,
  });

  const {
    data: leadProfile,
    isLoading: leadProfileLoading,
    error: leadProfileError,
    refetch: refetchLeadProfile,
  } = useQuery({
    queryKey: ["lead-profile", params?.id],
    queryFn: () => leadsService.getLeadById(params?.id || ""),
    enabled: !!params?.id && params.id !== "",
  });

  const allLeads = query.data?.leads || [];

  // 1. Filtering Logic (Client-side fallback for assignedToSalesId)
  let filteredLeads = [...allLeads];

  if (params?.assignedToSalesId) {
    filteredLeads = filteredLeads.filter(
      (lead) => lead.assignedToSales?.user?.id === params.assignedToSalesId
    );
  }

  // Status filtering
  // if (params.status && params.status !== "all") {
  //   if (params.status === "claimed") {
  //     // Definition: Claimed leads are those that have been contacted, converted, or rejected (managed)
  //     filteredLeads = filteredLeads.filter((l) => l.status !== "pending");
  //   } else if (params.status === "unclaimed") {
  //     // Definition: Unclaimed leads are those still in 'pending' status
  //     filteredLeads = filteredLeads.filter((l) => l.status === "pending");
  //   } else {
  //     filteredLeads = filteredLeads.filter((l) => l.status === params.status);
  //   }
  // }

  // Search filtering (Removed redundant client-side filtering)

  // 2. Sorting Logic
  // const sortOrder = params["orderBy.createdAt"] || "desc";
  // filteredLeads.sort((a, b) => {
  //   const dateA = new Date(a.createdAt).getTime();
  //   const dateB = new Date(b.createdAt).getTime();
  //   return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  // });

  // 3. Pagination Logic
  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const leads = filteredLeads;
  const total = params?.assignedToSalesId
    ? leads.length
    : query.data?.total || 0;

  return {
    ...query,
    data: {
      ...query.data,
      leads,
      total,
      page,
      limit,
    } as LeadsResponse,

    leadProfile,
    leadProfileLoading,
    leadProfileError,
    refetchLeadProfile,
  };
}

export function useLeadsStats() {
  return useQuery({
    queryKey: ["leads-stats"],
    queryFn: () => leadsService.getLeadsStats(),
  });
}
