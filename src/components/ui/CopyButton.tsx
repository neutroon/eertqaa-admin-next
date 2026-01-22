"use client";

import { useState } from "react";
import { DocumentDuplicateIcon, CheckIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
    value: string;
    className?: string;
}

export default function CopyButton({ value, className }: CopyButtonProps) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row/card click events
        try {
            await navigator.clipboard.writeText(value);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={cn(
                "p-1 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                isCopied
                    ? "text-green-600 bg-green-50"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
                className
            )}
            title={isCopied ? "تم النسخ!" : "نسخ رقم الهاتف"}
        >
            <span className="sr-only">{isCopied ? "Copied" : "Copy"}</span>
            {isCopied ? (
                <CheckIcon className="w-4 h-4 animate-in zoom-in duration-200" />
            ) : (
                <DocumentDuplicateIcon className="w-4 h-4" />
            )}
        </button>
    );
}
