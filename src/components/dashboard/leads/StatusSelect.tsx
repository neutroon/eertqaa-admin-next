"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { cn } from "@/lib/utils";

interface StatusSelectProps {
    status: string;
    onChange: (newStatus: string) => void;
    isLoading?: boolean;
    disabled?: boolean;
}

const statusOptions = [
    { value: "pending", label: "في الانتظار", color: "bg-yellow-100 text-yellow-800" },
    { value: "contacted", label: "تم التواصل", color: "bg-blue-100 text-blue-800" },
    { value: "converted", label: "تم الحجز", color: "bg-green-100 text-green-800" },
    { value: "rejected", label: "غير مهتم", color: "bg-red-100 text-red-800" },
];

export default function StatusSelect({
    status,
    onChange,
    isLoading = false,
    disabled = false,
}: StatusSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentOption = statusOptions.find((opt) => opt.value === status) || statusOptions[0];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleStatusChange = (value: string) => {
        onChange(value);
        setIsOpen(false);
    };

    return (
        <div className="relative w-40" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => !disabled && !isLoading && setIsOpen(!isOpen)}
                disabled={disabled || isLoading}
                className={`relative w-full cursor-pointer rounded-lg border border-transparent shadow-sm px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isLoading || disabled
                    ? "bg-gray-50 opacity-60 cursor-not-allowed"
                    : `${currentOption.color} hover:opacity-80`
                    }`}
            >
                <span className="flex items-center justify-between">
                    <span className="block truncate text-sm font-medium">
                        {currentOption.label}
                    </span>
                    <span className="pointer-events-none flex items-center pr-2">
                        {isLoading ? (
                            <LoadingSpinner size="sm" />
                        ) : (
                            <ChevronDownIcon
                                className={`h-4 w-4 opacity-70 transition-transform ${isOpen ? "transform rotate-180" : ""
                                    }`}
                                aria-hidden="true"
                            />
                        )}
                    </span>
                </span>
            </button>

            {isOpen && (
                <ul className="absolute z-50 mt-2 max-h-60 w-full overflow-hidden rounded-xl bg-white p-1.5 text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm animate-in fade-in slide-in-from-top-2 duration-200">
                    {statusOptions.map((option) => (
                        <li
                            key={`status-${option.value}`}
                            className={cn(
                                "group relative cursor-pointer select-none py-2.5 px-3 rounded-lg transition-all mb-1 last:mb-0 flex items-center justify-between",
                                option.value === status
                                    ? `${option.color} font-bold ring-2 ring-white shadow-sm scale-[1.02] z-10`
                                    : cn(
                                        "text-gray-700 hover:text-gray-900 border border-transparent",
                                        option.value === "pending" ? "hover:bg-yellow-100/80 hover:border-yellow-200" :
                                            option.value === "contacted" ? "hover:bg-blue-100/80 hover:border-blue-200" :
                                                option.value === "converted" ? "hover:bg-green-100/80 hover:border-green-200" : "hover:bg-red-100/80 hover:border-red-200"
                                    )
                            )}
                            onClick={() => handleStatusChange(option.value)}
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className={cn(
                                        "h-2.5 w-2.5 flex-shrink-0 rounded-full shadow-inner",
                                        option.value === "pending" ? "bg-yellow-400" :
                                            option.value === "contacted" ? "bg-blue-400" :
                                                option.value === "converted" ? "bg-green-400" : "bg-red-400"
                                    )}
                                    aria-hidden="true"
                                />
                                <span className="block truncate">
                                    {option.label}
                                </span>
                            </div>

                            {option.value === status && (
                                <CheckIcon className="h-4 w-4 shrink-0 transition-all scale-110" aria-hidden="true" />
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
