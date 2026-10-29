import type { Workbook } from "exceljs";
import type { Lead } from "@/config/api";

const STATUS_LABELS: Record<string, string> = {
  pending: "في الانتظار",
  contacted: "تم التواصل",
  converted: "تم الحجز",
  rejected: "غير مهتم",
};

const SOURCE_LABELS: Record<string, string> = {
  "Cairo University": "جامعة القاهرة",
  "Ain Shams University": "جامعة عين شمس",
  website: "الموقع الإلكتروني",
  messenger: "ماسنجر",
  whatsapp: "واتساب",
  facebook: "فيسبوك",
  "المساعد الذكي": "المساعد الذكي",
};

const HEADER_FILL = "FF1D4ED8";
const ALT_ROW_FILL = "FFF1F5F9";
const BORDER_COLOR = "FFE2E8F0";
const WORKSHEET_NAME = "العملاء المحتملين";

interface ColumnDefinition {
  header: string;
  width: number;
  value: (lead: Lead) => string | Date;
  isPhone?: boolean;
  isDate?: boolean;
  wrap?: boolean;
}

const COLUMNS: ColumnDefinition[] = [
  { header: "اسم العميل", width: 26, value: (lead) => lead.name || "" },
  {
    header: "رقم الهاتف",
    width: 20,
    value: (lead) => lead.phone || "",
    isPhone: true,
  },
  {
    header: "الجامعة / الجهة",
    width: 22,
    value: (lead) => {
      const source = lead.source ? String(lead.source) : "";
      return SOURCE_LABELS[source] || source || "غير محدد";
    },
  },
  {
    header: "البرنامج / الدورة",
    width: 28,
    value: (lead) => lead.selectedProgram?.name || "",
    wrap: true,
  },
  {
    header: "طريقة الحضور / التواصل",
    width: 24,
    value: (lead) => lead.learningPreference || "",
    wrap: true,
  },
  {
    header: "حالة الطلب",
    width: 16,
    value: (lead) => STATUS_LABELS[lead.status] || lead.status || "",
  },
  {
    header: "تاريخ التسجيل",
    width: 20,
    value: (lead) => parseDate(lead.createdAt),
    isDate: true,
  },
  {
    header: "مندوب المبيعات",
    width: 22,
    value: (lead) => lead.assignedToSales?.user?.name || "غير مخصص",
  },
  {
    header: "آخر تواصل",
    width: 20,
    value: (lead) => parseDate(lead.lastContactedAt),
    isDate: true,
  },
  {
    header: "ملاحظات العميل",
    width: 34,
    value: (lead) => lead.message || "",
    wrap: true,
  },
  {
    header: "ملاحظات الإدارة",
    width: 34,
    value: (lead) => lead.adminNote || "",
    wrap: true,
  },
];

function parseDate(value?: string | null): string | Date {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  // Shift by the local offset so Excel renders local time instead of UTC.
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
}

function sanitizeText(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = String(value);
  // Cells are written as plain strings, so only a leading "=" can be
  // interpreted as a formula. Keep "+", "-" and "@" intact (valid phone
  // prefixes and note text) instead of corrupting them with a quote.
  return text.startsWith("=") ? `'${text}` : text;
}

function measureWidth(value: string): number {
  return Array.from(value).reduce(
    (length, char) => length + (/[\u0600-\u06FF]/.test(char) ? 1.6 : 1),
    0,
  );
}

export function buildLeadsExportFileName(reference: Date = new Date()): string {
  const year = reference.getFullYear();
  const month = String(reference.getMonth() + 1).padStart(2, "0");
  const day = String(reference.getDate()).padStart(2, "0");
  return `leads-export-${year}-${month}-${day}.xlsx`;
}

export async function buildLeadsWorkbook(leads: Lead[]): Promise<Workbook> {
  const excelModule = (await import("exceljs")) as unknown as {
    default?: { Workbook: new () => Workbook };
    Workbook?: new () => Workbook;
  };
  const ExcelWorkbook = excelModule.default?.Workbook ?? excelModule.Workbook;
  if (!ExcelWorkbook) {
    throw new Error("تعذر تحميل مكتبة إنشاء ملفات Excel");
  }

  const workbook = new ExcelWorkbook();
  workbook.creator = "Eertqaa Dashboard";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(WORKSHEET_NAME, {
    views: [{ state: "frozen", ySplit: 1, rightToLeft: true }],
  });

  worksheet.columns = COLUMNS.map((column) => ({
    header: column.header,
    key: column.header,
    width: column.width,
  }));

  const computedWidths = COLUMNS.map((column) => column.width);

  leads.forEach((lead, rowIndex) => {
    const values = COLUMNS.map((column, columnIndex) => {
      const raw = column.value(lead);
      if (column.isDate) return raw;

      const text = sanitizeText(raw);
      const width = measureWidth(text) + 4;
      if (width > computedWidths[columnIndex]) {
        computedWidths[columnIndex] = Math.min(50, width);
      }
      return text;
    });

    const row = worksheet.addRow(values);
    const isAlternate = rowIndex % 2 === 1;

    row.height = 20;
    row.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
      const column = COLUMNS[columnNumber - 1];
      cell.alignment = {
        vertical: "middle",
        horizontal: column.isDate || column.isPhone ? "center" : "right",
        wrapText: Boolean(column.wrap),
        readingOrder: "rtl",
      };
      cell.border = {
        bottom: { style: "hair", color: { argb: BORDER_COLOR } },
      };
      if (isAlternate) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: ALT_ROW_FILL },
        };
      }
      if (column.isPhone) {
        cell.numFmt = "@";
      } else if (column.isDate) {
        cell.numFmt = "yyyy-mm-dd hh:mm";
      }
    });
  });

  const headerRow = worksheet.getRow(1);
  headerRow.height = 26;
  headerRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: HEADER_FILL },
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      readingOrder: "rtl",
    };
    cell.border = {
      bottom: { style: "thin", color: { argb: HEADER_FILL } },
    };
  });

  worksheet.columns.forEach((column, index) => {
    column.width = Math.max(12, Math.round(computedWidths[index]));
  });

  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: leads.length + 1, column: COLUMNS.length },
  };

  return workbook;
}
