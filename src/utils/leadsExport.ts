import { Lead } from "@/config/api";
import { leadsService } from "@/services/leads";
import { buildLeadsExportFileName, buildLeadsWorkbook } from "./leadsWorkbook";

export async function fetchAllLeadsForExport(): Promise<Lead[]> {
  const response = await leadsService.getLeadsForExport();
  return response.leads || [];
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
