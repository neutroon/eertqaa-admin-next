"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative inline-block text-right">{children}</div>;
};

const DropdownMenuTrigger = ({ 
  children, 
  asChild 
}: { 
  children: React.ReactNode; 
  asChild?: boolean 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={triggerRef} className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>
        {children}
      </div>
      <AnimatePresence>
        {isOpen && (
          <div onClick={(e) => e.stopPropagation()}>
            {React.Children.map(triggerRef.current?.nextElementSibling?.childNodes, child => {
                // This is a bit hacky but works for a custom implementation
                return child;
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simplified version for the task
export const DropdownMenuContent = ({ children, className, align = "right" }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: -10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: -10 }}
    className={cn(
      "absolute z-50 min-w-[8rem] overflow-hidden rounded-xl border border-gray-200 bg-white p-1 text-gray-950 shadow-xl",
      align === "start" ? "left-0" : "right-0",
      className
    )}
  >
    {children}
  </motion.div>
);

export const DropdownMenuItem = ({ children, onClick, className }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors hover:bg-gray-100 hover:text-gray-900",
      className
    )}
  >
    {children}
  </button>
);

export const DropdownMenuSeparator = ({ className }: any) => (
  <div className={cn("-mx-1 my-1 h-px bg-gray-100", className)} />
);

// Redefining to be more robust
export { DropdownMenu };
export const DropdownMenuTriggerReal = ({ children, onClick }: any) => (
    <div onClick={onClick} className="cursor-pointer">
        {children}
    </div>
);
