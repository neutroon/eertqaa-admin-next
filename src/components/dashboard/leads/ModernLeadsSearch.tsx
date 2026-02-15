"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    Search,
    X,
    Filter,
    History,
    TrendingUp,
    User,
    Phone,
    BookOpen,
    Mic,
    Download,
    Command,
    ChevronDown,
    Share2,
    Check,
    Clock,
    MessageSquare,
    CheckCircle2,
    UserX,
    Lock,
    Unlock,
    LayoutGrid,
    RotateCcw,
    Globe,
    Building2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Lead, LeadsStatsResponse } from "@/config/api";
import { cn } from "@/lib/utils";

interface ModernLeadsSearchProps {
    search: string;
    status?: string;
    isLocked?: string;
    totalResults: number;
    filteredResults: number;
    onFilterChange: (updates: Record<string, string | number | undefined>) => void;
    allLeads?: Lead[];
    isLoading?: boolean;
    stats?: LeadsStatsResponse;
    source: "website" | "Cairo University" | "Ain Shams University" | "facebook" | "whatsapp";
}

export default function ModernLeadsSearch({
    search,
    status,
    isLocked,
    totalResults,
    filteredResults,
    onFilterChange,
    allLeads = [],
    isLoading = false,
    stats,
    source,
}: ModernLeadsSearchProps) {
    const [searchValue, setSearchValue] = useState(search);
    const [isFocused, setIsFocused] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showFiltersPopover, setShowFiltersPopover] = useState(false);
    const [isQuickFiltersVisible, setIsQuickFiltersVisible] = useState(false);
    const [wasCopied, setWasCopied] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const filtersPopoverRef = useRef<HTMLDivElement>(null);
    const filtersTriggerRef = useRef<HTMLButtonElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("recentLeadsSearches");
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    const saveRecentSearch = (term: string) => {
        if (!term.trim()) return;
        const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem("recentLeadsSearches", JSON.stringify(updated));
    };

    // Debounce search update
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue !== search) {
                onFilterChange({ search: searchValue, page: 1 });
                if (searchValue.trim()) saveRecentSearch(searchValue);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchValue, onFilterChange, search]);

    // Handle external search clearing
    useEffect(() => {
        setSearchValue(search);
    }, [search]);

    // Accessibility: Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                inputRef.current?.focus();
            }
            if (e.key === "Escape") {
                setShowDropdown(false);
                inputRef.current?.blur();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Results dropdown
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
            // Filters popover
            if (
                showFiltersPopover &&
                filtersPopoverRef.current &&
                !filtersPopoverRef.current.contains(event.target as Node) &&
                filtersTriggerRef.current &&
                !filtersTriggerRef.current.contains(event.target as Node)
            ) {
                setShowFiltersPopover(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showFiltersPopover]);

    const autocompleteResults = allLeads
        .filter(lead =>
            lead.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
            lead.phone?.includes(searchValue) ||
            lead.selectedProgram?.name.toLowerCase().includes(searchValue.toLowerCase())
        )
        .slice(0, 5);

    const highlightText = (text: string, highlight: string) => {
        if (!highlight.trim()) return text;
        const parts = text?.split(new RegExp(`(${highlight})`, "gi"));
        return (
            <>
                {parts?.map((part, i) =>
                    part.toLowerCase() === highlight.toLowerCase() ? (
                        <span key={`${part}-${i}`} className="bg-yellow-100 text-yellow-900 rounded-sm px-0.5">
                            {part}
                        </span>
                    ) : (
                        <React.Fragment key={i}>{part}</React.Fragment>
                    )
                )}
            </>
        );
    };

    const quickFilters = [
        {
            label: "الكل",
            value: "",
            active: !status && !isLocked,
            count: stats?.totalLeads,
            icon: LayoutGrid,
            activeClassName: "bg-blue-600 text-white shadow-md ring-2 ring-blue-100",
            inactiveClassName: "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
        },
        {
            label: "في الانتظار",
            value: "pending",
            active: status === "pending",
            count: stats?.pendingLeads,
            icon: Clock,
            activeClassName: "bg-yellow-500 text-white shadow-md ring-2 ring-yellow-100",
            inactiveClassName: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100/80 border-yellow-100"
        },
        {
            label: "تم التواصل",
            value: "contacted",
            active: status === "contacted",
            count: stats?.contactedLeads,
            icon: MessageSquare,
            activeClassName: "bg-blue-500 text-white shadow-md ring-2 ring-blue-100",
            inactiveClassName: "bg-blue-50 text-blue-700 hover:bg-blue-100/80 border-blue-100"
        },
        {
            label: "تم الحجز",
            value: "converted",
            active: status === "converted",
            count: stats?.convertedLeads,
            icon: CheckCircle2,
            activeClassName: "bg-green-600 text-white shadow-md ring-2 ring-green-100",
            inactiveClassName: "bg-green-50 text-green-700 hover:bg-green-100/80 border-green-100"
        },
        {
            label: "غير مهتم",
            value: "rejected",
            active: status === "rejected",
            count: stats?.rejectedLeads,
            icon: UserX,
            activeClassName: "bg-red-500 text-white shadow-md ring-2 ring-red-100",
            inactiveClassName: "bg-red-50 text-red-700 hover:bg-red-100/80 border-red-100"
        },
        {
            label: "تم الاستلام",
            value: "isLocked:true",
            active: isLocked === "true",
            count: stats?.claimedLeads,
            icon: Lock,
            activeClassName: "bg-purple-600 text-white shadow-md ring-2 ring-purple-100",
            inactiveClassName: "bg-purple-50 text-purple-700 hover:bg-purple-100/80 border-purple-100"
        },
        {
            label: "متاح للاستلام",
            value: "isLocked:false",
            active: isLocked === "false",
            count: stats?.unclaimedLeads,
            icon: Unlock,
            activeClassName: "bg-amber-500 text-white shadow-md ring-2 ring-amber-100",
            inactiveClassName: "bg-amber-50 text-amber-700 hover:bg-amber-100/80 border-amber-100"
        },
        {
            label: "جامعة القاهرة",
            value: "source:Cairo University",
            active: source === "Cairo University",
            // count: stats?.unclaimedLeads,
            icon: Building2,
            activeClassName: "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-100",
            inactiveClassName: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80 border-emerald-100"
        },
        {
            label: "جامعة عين شمس",
            value: "source:Ain Shams University",
            active: source === "Ain Shams University",
            // count: stats?.unclaimedLeads,
            icon: Building2,
            activeClassName: "bg-violet-600 text-white shadow-md ring-2 ring-violet-100",
            inactiveClassName: "bg-violet-50 text-violet-700 hover:bg-violet-100/80 border-violet-100"
        },
        {
            label: "الموقع",
            value: "source:website",
            active: source === "website",
            // count: stats?.unclaimedLeads,
            icon: Globe,
            activeClassName: "bg-sky-500 text-white shadow-md ring-2 ring-sky-100",
            inactiveClassName: "bg-sky-50 text-sky-700 hover:bg-sky-100/80 border-sky-100"
        },
    ];

    const handleQuickFilterClick = (value: string) => {
        if (value.startsWith("isLocked:")) {
            const lockVal = value.split(":")[1];
            onFilterChange({ isLocked: lockVal, status: undefined, source: undefined, page: 1 });
        } else if (value.startsWith("source:")) {
            const sourceVal = value.split(":")[1];
            onFilterChange({ source: sourceVal, status: undefined, isLocked: undefined, page: 1 });
        } else {
            onFilterChange({ status: value || undefined, isLocked: undefined, source: undefined, page: 1 });
        }
    };

    const handleStatusValues = (value: string) => {
        switch (value) {
            case "converted":
                return "تم الحجز";
            case "contacted":
                return "تم التواصل";
            case "pending":
                return "في الانتظار";
            case "rejected":
                return "غير مهتم";
            case "isLocked:true":
                return "تم الاستلام";
            case "isLocked:false":
                return "متاح للاستلام";
            default:
                return "";
        }
    };

    const activeFilters = [
        ...(status ? [{ label: `الحالة: ${handleStatusValues(status)}`, key: "status" }] : []),
        ...(isLocked === "true" ? [{ label: "تم الاستلام", key: "isLocked" }] : []),
        ...(isLocked === "false" ? [{ label: "متاح للاستلام", key: "isLocked" }] : []),
        ...(source ? [{ label: `المصدر: ${source}`, key: "source" }] : []),
    ];

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setWasCopied(true);
            setTimeout(() => setWasCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    return (
        <div className="w-full space-y-4 font-sans" dir="rtl">
            {/* Search Header Area */}
            <div className="relative group mb-0">
                <div className={cn(
                    "relative flex items-center bg-white rounded-xl border transition-all duration-300 h-[52px]",
                    isFocused
                        ? "border-blue-500 ring-4 ring-blue-50/50 shadow-sm"
                        : "border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:border-gray-300 hover:bg-gray-50/50"
                )}>
                    {/* Search Icon */}
                    <div className="absolute right-4 text-gray-400 group-hover:text-blue-500 transition-colors">
                        <Search className="w-5 h-5" />
                    </div>

                    {/* Main Input */}
                    <input
                        ref={inputRef}
                        type="text"
                        className="w-full bg-transparent px-12 text-gray-900 text-base outline-none placeholder:text-gray-400"
                        placeholder="ابحث بالاسم أو رقم الهاتف..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onFocus={() => {
                            setIsFocused(true);
                            setShowDropdown(true);
                        }}
                        onBlur={() => setIsFocused(false)}
                    />

                    {/* Action Buttons Area */}
                    <div className="absolute left-3 flex items-center space-x-2 space-x-reverse">
                        {isLoading && (
                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />
                        )}

                        {searchValue && (
                            <button
                                onClick={() => {
                                    setSearchValue("");
                                    onFilterChange({ search: "", page: 1 });
                                }}
                                className="p-1.5 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}

                        <div className="hidden sm:flex items-center px-2 py-1 bg-gray-100 border border-gray-200 rounded-md gap-1 ml-2">
                            <Command className="w-3 h-3 text-gray-400" />
                            <span className="text-[10px] font-bold text-gray-500">K</span>
                        </div>

                        <button
                            ref={filtersTriggerRef}
                            onClick={() => setShowFiltersPopover(!showFiltersPopover)}
                            className={cn(
                                "p-2 rounded-lg transition-colors",
                                showFiltersPopover ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"
                            )}
                        >
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Filters Popover */}
                <AnimatePresence>
                    {showFiltersPopover && (
                        <motion.div
                            ref={filtersPopoverRef}
                            key="filters-popover"
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 8, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute left-0 top-full w-72 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 shadow-2xl z-[110] overflow-hidden"
                        >
                            <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                                        <Filter className="w-4 h-4" />
                                    </div>
                                    <h4 className="font-black text-gray-900 text-sm">تصفية متقدمة</h4>
                                </div>
                                <button onClick={() => setShowFiltersPopover(false)} className="p-1 hover:bg-gray-200 rounded-full text-gray-400 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-4 space-y-5">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <LayoutGrid className="w-3.5 h-3.5 text-gray-400" />
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">تصفية حسب الحالة</label>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: "pending", label: "في الانتظار", color: "yellow", icon: Clock },
                                            { id: "contacted", label: "تم التواصل", color: "blue", icon: MessageSquare },
                                            { id: "converted", label: "تم الحجز", color: "green", icon: CheckCircle2 },
                                            { id: "rejected", label: "غير مهتم", color: "red", icon: UserX }
                                        ].map(s => (
                                            <button
                                                key={s.id}
                                                onClick={() => onFilterChange({ status: s.id, page: 1 })}
                                                className={cn(
                                                    "px-3 py-2.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-2 group",
                                                    status === s.id
                                                        ? `bg-${s.color}-500 border-${s.color}-600 text-white shadow-lg shadow-${s.color}-100 scale-[1.02]`
                                                        : `bg-${s.color}-50/50 border-${s.color}-100 text-${s.color}-700 hover:bg-${s.color}-50 hover:border-${s.color}-200`
                                                )}
                                            >
                                                <s.icon className={cn("w-4 h-4", status === s.id ? "text-white" : `text-${s.color}-500 opacity-70`)} />
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Lock className="w-3.5 h-3.5 text-gray-400" />
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">حالة المتابعة</label>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => onFilterChange({ isLocked: "true", page: 1 })}
                                            className={cn(
                                                "px-3 py-2.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-2",
                                                isLocked === "true"
                                                    ? "bg-purple-600 border-purple-700 text-white shadow-lg shadow-purple-100 scale-[1.02]"
                                                    : "bg-purple-50/50 border-purple-100 text-purple-700 hover:bg-purple-50"
                                            )}
                                        >
                                            <Lock className={cn("w-4 h-4", isLocked === "true" ? "text-white" : "text-purple-500 opacity-70")} />
                                            تمت المتابعة
                                        </button>
                                        <button
                                            onClick={() => onFilterChange({ isLocked: "false", page: 1 })}
                                            className={cn(
                                                "px-3 py-2.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-2",
                                                isLocked === "false"
                                                    ? "bg-amber-500 border-amber-600 text-white shadow-lg shadow-amber-100 scale-[1.02]"
                                                    : "bg-amber-50/50 border-amber-100 text-amber-700 hover:bg-amber-50"
                                            )}
                                        >
                                            <Unlock className={cn("w-4 h-4", isLocked === "false" ? "text-white" : "text-amber-600 opacity-70")} />
                                            بانتظار المتابعة
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onFilterChange({ status: undefined, isLocked: undefined, source: undefined, search: "", page: 1 })}
                                    className="w-full py-3 bg-red-50 text-red-600 text-xs font-black rounded-xl hover:bg-red-100 border border-red-100 transition-all flex items-center justify-center gap-2 mt-2"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    إعادة تعيين كافة المرشحات
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Dropdown Results */}
                <AnimatePresence>
                    {showDropdown && (isFocused || (showDropdown && (searchValue || recentSearches.length > 0))) && (
                        <motion.div
                            ref={dropdownRef}
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 8, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            className="absolute top-full right-0 left-0 bg-white rounded-xl border border-gray-200 shadow-2xl z-[100] overflow-hidden"
                        >
                            {/* Autocomplete Results */}
                            {searchValue && autocompleteResults.length > 0 && (
                                <div className="p-2 border-b border-gray-50">
                                    <div className="px-3 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">النتائج المقترحة</div>
                                    {autocompleteResults.map((lead) => (
                                        <button
                                            key={lead.id}
                                            onClick={() => {
                                                setSearchValue(lead.name);
                                                setShowDropdown(false);
                                            }}
                                            className="w-full flex items-center p-3 hover:bg-blue-50 rounded-lg transition-colors group text-right"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ml-3">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-gray-900 truncate">
                                                    {highlightText(lead.name, searchValue)}
                                                </div>
                                                <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3 space-x-reverse">
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="w-3 h-3" />
                                                        {highlightText(lead.phone, searchValue)}
                                                    </span>
                                                    <span className="flex items-center gap-1 truncate">
                                                        <BookOpen className="w-3 h-3" />
                                                        {highlightText(lead.selectedProgram.name, searchValue)}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Recent Searches */}
                            {!searchValue && recentSearches.length > 0 && (
                                <div className="p-2">
                                    <div className="px-3 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">عمليات البحث الأخيرة</div>
                                    {recentSearches.map((term, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setSearchValue(term);
                                                setShowDropdown(false);
                                            }}
                                            className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors group text-right"
                                        >
                                            <History className="w-4 h-4 text-gray-400 ml-3" />
                                            <span className="text-gray-700">{term}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Empty Search State in Dropdown */}
                            {searchValue && autocompleteResults.length === 0 && (
                                <div className="p-8 text-center bg-gray-50/50">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div className="text-gray-900 font-medium mb-1">لا توجد نتائج لـ "{searchValue}"</div>
                                    <div className="text-gray-500 text-sm">تأكد من كتابة الاسم أو الرقم بشكل صحيح</div>
                                </div>
                            )}

                            {/* Quick Actions Footer */}
                            <div className="p-3 bg-gray-50/80 border-t border-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded leading-none">ESC</span>
                                    <span className="text-[11px] text-gray-500">للإغلاق</span>
                                </div>
                                <button className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
                                    النتائج الأكثر شيوعاً
                                    <TrendingUp className="w-3 h-3" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Filters and Metadata Area */}
            <div className="flex flex-col gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* Quick Filter Buttons */}
                    <AnimatePresence>
                        {isQuickFiltersVisible && (
                            <motion.div

                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className={`overflow-hidden w-full sm:w-auto ${activeFilters.length > 0 ? "-ms-5" : ""} transition-all`}
                            >
                                <div className="flex items-center flex-wrap justify-center sm:justify-start bg-gray-50/50 border border-gray-200 border-t-0 rounded-xl p-1.5 shadow-sm gap-2 max-w-full">
                                    {quickFilters.map((filter) => (
                                        <button
                                            key={filter.label}
                                            onClick={() => handleQuickFilterClick(filter.value)}
                                            className={cn(
                                                "px-3 py-2 rounded-lg text-[13px] font-bold transition-all whitespace-nowrap border flex items-center gap-2",
                                                filter.active
                                                    ? filter.activeClassName
                                                    : cn("border-transparent", filter.inactiveClassName)
                                            )}
                                        >
                                            <filter.icon className={cn("w-4 h-4", filter.active ? "text-current" : "opacity-70")} />
                                            <span>{filter.label}</span>
                                            {filter.count !== undefined && (
                                                <span className={cn(
                                                    "px-1.5 py-0.5 rounded-md text-[10px] min-w-[24px] text-center font-black",
                                                    filter.active
                                                        ? "bg-white/20 text-white"
                                                        : "bg-white/50 text-current shadow-sm"
                                                )}>
                                                    {filter.count}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="popLayout" >
                        <div className="flex flex-wrap items-center gap-2">

                            {/* Active Filter Chips */}
                            {activeFilters.map((filter) => (
                                <motion.div
                                    key={`${filter.key}-${filter.label}`}
                                    initial={{ opacity: 0, scale: 0.9, x: -20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, x: -20 }}
                                    className="flex items-center bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full text-xs font-medium gap-2 group"
                                >
                                    {filter.label}
                                    <button
                                        onClick={() => onFilterChange({ [filter.key]: undefined, page: 1 })}
                                        className="p-0.5 hover:bg-blue-200 rounded-full transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                    </AnimatePresence>

                </div>

                {/* Counter and Export */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleShare}
                            className={cn(
                                "inline-flex items-center px-3 py-1.5 border rounded-lg text-sm font-medium transition-all gap-2",
                                wasCopied
                                    ? "bg-green-50 text-green-600 border-green-200"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            )}
                        >
                            {wasCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                            {wasCopied ? "تم النسخ" : "مشاركة"}
                        </button>
                        <button
                            onClick={() => setIsQuickFiltersVisible(!isQuickFiltersVisible)}
                            className={cn(
                                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border",
                                isQuickFiltersVisible
                                    ? "bg-blue-50 text-blue-600 border-blue-100"
                                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                            )}
                        >
                            <Filter className="w-3.5 h-3.5" />
                            {isQuickFiltersVisible ? "إخفاء التصنيفات" : "إظهار التصنيفات"}
                            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isQuickFiltersVisible ? "rotate-180" : "")} />
                        </button>
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                        عرض <span className="font-bold text-gray-900">{filteredResults}</span> من <span className="text-gray-400">{totalResults}</span> نتائج
                    </span>

                    {/* <div className="flex items-center gap-2">
                        <button className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors gap-2">
                            <Download className="w-4 h-4" />
                            تصدير
                        </button>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
