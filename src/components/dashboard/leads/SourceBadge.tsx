"use client";

import { LeadSource } from "@/config/api";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { BotIcon } from "lucide-react";

const sourceConfig = {
  "Cairo University": {
    label: "جامعة القاهرة",
    icon: GlobeAltIcon,
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    iconColor: "text-blue-500",
  },
  "Ain Shams University": {
    label: "جامعة عين شمس",
    icon: GlobeAltIcon,
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    iconColor: "text-blue-500",
  },

  website: {
    label: "الموقع",
    icon: GlobeAltIcon,
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    iconColor: "text-blue-500",
  },
  "المساعد الذكي": {
    label: "المساعد الذكي (AI Agent)",
    icon: BotIcon,
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
    iconColor: "text-purple-500",
  },
};

export default function SourceBadge({ source }: { source?: LeadSource }) {
  if (!source) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200">
        <GlobeAltIcon className="w-3.5 h-3.5 text-gray-400" />
        غير محدد
      </span>
    );
  }

  const config = sourceConfig[source as keyof typeof sourceConfig] || {
    label: source,
    icon: GlobeAltIcon,
    bgColor: "bg-gray-50",
    textColor: "text-gray-700",
    borderColor: "border-gray-200",
    iconColor: "text-gray-500",
  };
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${config.bgColor} ${config.textColor} border ${config.borderColor} shadow-sm`}
    >
      <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
      {config.label}
    </span>
  );
}
