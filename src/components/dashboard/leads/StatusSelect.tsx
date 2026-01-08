"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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
                <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {statusOptions.map((option) => (
                        <li
                            key={option.value}
                            className={`relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-50 transition-colors ${option.value === status ? "bg-blue-50" : ""
                                }`}
                            onClick={() => handleStatusChange(option.value)}
                        >
                            <div className="flex items-center">
                                <span
                                    className={`inline-block h-2 w-2 flex-shrink-0 rounded-full ${option.value === "pending"
                                        ? "bg-yellow-400"
                                        : option.value === "contacted"
                                            ? "bg-blue-400"
                                            : option.value === "converted"
                                                ? "bg-green-400"
                                                : "bg-red-400"
                                        }`}
                                    aria-hidden="true"
                                />
                                <span
                                    className={`mr-3 block truncate ${option.value === status
                                        ? "font-semibold text-blue-900"
                                        : "font-normal text-gray-900"
                                        }`}
                                >
                                    {option.label}
                                </span>
                            </div>

                            {option.value === status ? (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                                    <CheckIcon className="h-4 w-4" aria-hidden="true" />
                                </span>
                            ) : null}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
