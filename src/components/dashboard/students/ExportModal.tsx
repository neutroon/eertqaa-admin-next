"use client";

import { useState } from "react";
import { XMarkIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";

interface ExportModalProps {
  onClose: () => void;
  data: any[];
}

export default function ExportModal({ onClose, data }: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState("excel");
  const [includeFields, setIncludeFields] = useState({
    personalInfo: true,
    contactInfo: true,
    courses: true,
    emergencyContact: true,
    notes: true,
  });

  const handleExport = () => {
    const exportData = data.map((student) => {
      const baseData = {
        "الاسم الأول": student.firstName,
        "الاسم الأخير": student.lastName,
        "البريد الإلكتروني": student.email,
        "رقم الهاتف": student.phone,
        "تاريخ الميلاد": student.dateOfBirth
          ? new Date(student.dateOfBirth).toLocaleDateString("ar-EG")
          : "",
        الجنس: student.gender === "male" ? "ذكر" : "أنثى",
        الجنسية: student.nationality,
        المدينة: student.city,
        العنوان: student.address || "",
        "المستوى التعليمي": student.educationLevel || "",
        "الخبرة العملية": student.workExperience || "",
        "الكورسات المختارة": student.selectedCourses.join(", "),
        "تفضيل التعلم":
          student.learningPreference === "online"
            ? "أونلاين"
            : student.learningPreference === "offline"
            ? "أوفلاين"
            : "مختلط",
        "تاريخ التسجيل": student.registrationDate
          ? new Date(student.registrationDate).toLocaleDateString("ar-EG")
          : "",
        الحالة:
          student.status === "pending"
            ? "في الانتظار"
            : student.status === "approved"
            ? "موافق عليه"
            : student.status === "enrolled"
            ? "مسجل"
            : student.status === "completed"
            ? "مكتمل"
            : "ملغي",
        ملاحظات: student.notes || "",
      };

      if (includeFields.emergencyContact) {
        return {
          ...baseData,
          "اسم جهة الطوارئ": student.emergencyContact?.name || "",
          "هاتف جهة الطوارئ": student.emergencyContact?.phone || "",
          "صلة القرابة": student.emergencyContact?.relationship || "",
        };
      }

      return baseData;
    });

    if (exportFormat === "excel") {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "الطلاب");

      // Set column widths
      const colWidths = Object.keys(exportData[0] || {}).map(() => ({
        wch: 20,
      }));
      ws["!cols"] = colWidths;

      XLSX.writeFile(
        wb,
        `طلاب_إرتقاء_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } else {
      // CSV export
      const csvContent = [
        Object.keys(exportData[0] || {}).join(","),
        ...exportData.map((row) =>
          Object.values(row)
            .map((value) => `"${value}"`)
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `طلاب_إرتقاء_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            تصدير بيانات الطلاب
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              تنسيق التصدير
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="excel"
                  checked={exportFormat === "excel"}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="ml-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Excel (.xlsx)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="csv"
                  checked={exportFormat === "csv"}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="ml-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">CSV (.csv)</span>
              </label>
            </div>
          </div>

          {/* Fields to Include */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              الحقول المراد تصديرها
            </label>
            <div className="space-y-2">
              {Object.entries(includeFields).map(([key, value]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      setIncludeFields((prev) => ({
                        ...prev,
                        [key]: e.target.checked,
                      }))
                    }
                    className="ml-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {key === "personalInfo" && "المعلومات الشخصية"}
                    {key === "contactInfo" && "معلومات الاتصال"}
                    {key === "courses" && "الكورسات المختارة"}
                    {key === "emergencyContact" && "جهة الاتصال في الطوارئ"}
                    {key === "notes" && "الملاحظات"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Export Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              ملخص التصدير
            </h4>
            <div className="text-sm text-blue-700">
              <p>عدد الطلاب: {data.length}</p>
              <p>التنسيق: {exportFormat === "excel" ? "Excel" : "CSV"}</p>
              <p>
                الحقول المحددة:{" "}
                {Object.values(includeFields).filter(Boolean).length} من{" "}
                {Object.keys(includeFields).length}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              إلغاء
            </button>
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <DocumentArrowDownIcon className="w-4 h-4 ml-2" />
              تصدير البيانات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
