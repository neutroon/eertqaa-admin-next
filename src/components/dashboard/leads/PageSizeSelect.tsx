"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface PageSizeSelectProps {
    pageSize: number;
    onChange: (newPageSize: number) => void;
    disabled?: boolean;
    className?: string;
}

const sizeOptions = [10, 20, 50, 100];

export default function PageSizeSelect({
    pageSize,
    onChange,
    disabled = false,
    className,
}: PageSizeSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (value: number) => {
        onChange(value);
        setIsOpen(false);
    };

    return (
        <div className={cn("relative", className)} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-[12px] font-bold text-gray-600 hover:bg-white hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed group"
            >
                <span className="whitespace-nowrap">{pageSize} / صفحة</span>
                <ChevronDownIcon
                    className={cn(
                        "h-3.5 w-3.5 text-gray-400 group-hover:text-blue-500 transition-transform duration-200",
                        isOpen ? "transform rotate-180" : ""
                    )}
                    aria-hidden="true"
                />
            </button>

            {isOpen && (
                <ul className="absolute top-full mt-1 left-0 z-[100] min-w-[80px] overflow-hidden rounded-xl bg-white py-1 text-xs shadow-xl ring-1 ring-black/5 focus:outline-none animate-in fade-in zoom-in-95 duration-150">
                    {sizeOptions.map((size) => (
                        <li
                            key={size}
                            className={cn(
                                "relative cursor-pointer select-none py-2 px-3 hover:bg-blue-50 transition-colors flex items-center justify-between gap-3",
                                size === pageSize ? "bg-blue-50/50 text-blue-700 font-bold" : "text-gray-600"
                            )}
                            onClick={() => handleSelect(size)}
                        >
                            <span>{size}</span>
                            {size === pageSize && (
                                <CheckIcon className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
