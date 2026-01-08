"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";

interface PageSizeSelectProps {
    pageSize: number;
    onChange: (newPageSize: number) => void;
    disabled?: boolean;
}

const sizeOptions = [10, 20, 50, 100];

export default function PageSizeSelect({
    pageSize,
    onChange,
    disabled = false,
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
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className="relative flex items-center gap-2 cursor-pointer rounded-lg bg-white border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-w-[120px] justify-between"
            >
                <span className="block truncate">{pageSize} / صفحة</span>
                <ChevronDownIcon
                    className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? "transform rotate-180" : ""
                        }`}
                    aria-hidden="true"
                />
            </button>

            {isOpen && (
                <ul className="absolute bottom-full mb-1 z-50 w-full overflow-hidden rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {sizeOptions.map((size) => (
                        <li
                            key={size}
                            className={`relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-gray-50 transition-colors ${size === pageSize ? "bg-blue-50 text-blue-900" : "text-gray-900"
                                }`}
                            onClick={() => handleSelect(size)}
                        >
                            <span
                                className={`block truncate ${size === pageSize ? "font-semibold" : "font-normal"
                                    }`}
                            >
                                {size} / صفحة
                            </span>

                            {size === pageSize ? (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
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
