"use client";

import { useAuth } from "@/contexts/AuthContext";
import { SparklesIcon } from "@heroicons/react/24/outline";

export default function WelcomeBanner() {
    const { user } = useAuth();
    const currentHour = new Date().getHours();

    const getGreeting = () => {
        if (currentHour < 12) return "صباح الخير";
        if (currentHour < 18) return "مساء الخير";
        return "مساء الخير";
    };

    const currentDate = new Date().toLocaleDateString("ar-EG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-8 shadow-xl">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl"></div>

            <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <SparklesIcon className="h-6 w-6 text-yellow-300" />
                        <p className="text-blue-100 text-sm font-medium">{currentDate}</p>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {getGreeting()}, {user?.name || "المسؤول"} 👋
                    </h1>
                    <p className="text-blue-100 text-lg">
                        مرحباً بك في لوحة تحكم منصة إرتقاء التعليمية
                    </p>
                </div>

                {/* Decorative icon */}
                <div className="hidden md:block">
                    <div className="h-24 w-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
