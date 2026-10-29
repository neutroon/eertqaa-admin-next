import { Lead } from "@/config/api";
import { leadsService } from "@/services/leads";
import { buildLeadsExportFileName, buildLeadsWorkbook } from "./leadsWorkbook";

const EXPORT_PAGE_SIZE = 200;
const MAX_EXPORT_PAGES = 1000;

export async function fetchAllLeadsForExport(): Promise<Lead[]> {
  const collected: Lead[] = [];
  const seenIds = new Set<string>();
  let page = 1;
  let totalPages = 1;

  do {
    const response = await leadsService.getAllLeads({
      page,
      limit: EXPORT_PAGE_SIZE,
      "orderBy.createdAt": "desc",
    });

    const leads = response.leads || [];
    for (const lead of leads) {
      if (lead.id) {
        if (seenIds.has(lead.id)) continue;
        seenIds.add(lead.id);
      }
      collected.push(lead);
    }

    totalPages =
      Number(response.totalPages) ||
      Math.ceil((Number(response.total) || 0) / EXPORT_PAGE_SIZE);
    if (leads.length === 0) break;
    page += 1;
  } while (page <= totalPages && page <= MAX_EXPORT_PAGES);

  return collected;
}

export async function exportLeadsToExcel(leads: Lead[]): Promise<string> {
  if (leads.length === 0) {
    throw new Error("لا توجد بيانات للتصدير");
  }

  const workbook = await buildLeadsWorkbook(leads);
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const fileName = buildLeadsExportFileName();
  const url = URL.createObjectURL(blob);

  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } finally {
    URL.revokeObjectURL(url);
  }

  return fileName;
}
