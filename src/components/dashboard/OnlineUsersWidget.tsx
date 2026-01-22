"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { useSocketContext } from "@/components/providers/SocketProvider";
import {
    UsersIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    SignalIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

interface OnlineUser {
    id: string;
    name: string;
    role: string;
    phone?: string;
}

export default function OnlineUsersWidget({
    user,
}: {
    user: OnlineUser;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { data: onlineUsersData, isLoading } = useOnlineUsers();
    const { isConnected } = useSocketContext();

    // Handle different API response structures
    const users: OnlineUser[] = Array.isArray(onlineUsersData)
        ? onlineUsersData.filter((usr) => usr.id !== user.id)
        : (onlineUsersData as { users?: OnlineUser[] })?.users?.filter((usr) => usr.id !== user.id) || [];
    const userCount = users.length;

    return (
        <div className="fixed bottom-6 left-6 z-50">
            <AnimatePresence mode="wait">
                {isExpanded ? (
                    // Expanded Panel
                    <motion.div
                        key="expanded"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <UsersIcon className="w-5 h-5 text-white" />
                                    <motion.span
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"
                                    />
                                </div>
                                <span className="text-white font-semibold text-sm">
                                    المستخدمين المتصلين
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-white/90 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                    {userCount}
                                </span>
                                <button
                                    onClick={() => setIsExpanded(false)}
                                    className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Connection Status */}
                        <div className={`px-4 py-2 flex items-center gap-2 text-xs border-b border-gray-100 ${isConnected ? 'bg-emerald-50/50' : 'bg-red-50/50'}`}>
                            <SignalIcon className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-500' : 'text-red-500'}`} />
                            <span className={isConnected ? 'text-emerald-700' : 'text-red-700'}>
                                {isConnected ? 'متصل بالخادم' : 'غير متصل'}
                            </span>
                        </div>

                        {/* Users List */}
                        <div className="max-h-64 overflow-y-hidden">
                            {isLoading ? (
                                <div className="px-4 py-8 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                        <span className="text-xs text-gray-500">جاري التحميل...</span>
                                    </div>
                                </div>
                            ) : users.length === 0 ? (
                                <div className="px-4 py-8 text-center">
                                    <UsersIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">لا يوجد مستخدمين متصلين</p>
                                </div>
                            ) : (
                                <div className="py-2">
                                    {users.map((user, index) => (
                                        <motion.div
                                            key={user.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50/80 transition-colors"
                                        >
                                            {/* Avatar */}
                                            <div className="relative flex-shrink-0">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm">
                                                    <span className="text-white text-sm font-bold">
                                                        {user.name?.charAt(0) || "U"}
                                                    </span>
                                                </div>
                                                <motion.div
                                                    animate={{ scale: [1, 1.3, 1] }}
                                                    transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
                                                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white"
                                                />
                                            </div>

                                            {/* User Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {user.role === 'ADMIN' ? 'مدير' : user.role === 'SALES_AGENT' ? 'مندوب مبيعات' : user.role}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    // Collapsed Bubble
                    <motion.button
                        key="collapsed"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsExpanded(true)}
                        className="relative group"
                    >
                        {/* Main Button */}
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center justify-center transition-all group-hover:shadow-xl group-hover:shadow-emerald-500/40">
                            <UsersIcon className="w-6 h-6 text-white" />
                        </div>

                        {/* Count Badge */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 min-w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100"
                        >
                            <span className="text-xs font-bold text-emerald-600 px-1">
                                {isLoading ? "..." : userCount}
                            </span>
                        </motion.div>

                        {/* Connection Indicator */}
                        <motion.div
                            animate={{ scale: isConnected ? [1, 1.2, 1] : 1 }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className={`absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-white ${isConnected ? 'bg-emerald-400' : 'bg-red-400'
                                }`}
                        />

                        {/* Hover Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            المستخدمين المتصلين
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
