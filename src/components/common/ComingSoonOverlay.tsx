"use client";

import { useState } from "react";
import { XMarkIcon, ClockIcon } from "@heroicons/react/24/outline";

interface ComingSoonOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  expectedDate?: string;
}

export default function ComingSoonOverlay({
  isOpen,
  onClose,
  title = "قريباً",
  description = "هذه الصفحة قيد التطوير وسيتم إطلاقها قريباً",
  expectedDate,
}: ComingSoonOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <XMarkIcon className="w-5 h-5 text-gray-500" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
            <ClockIcon className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

          {/* Expected date */}
          {/* {expectedDate && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 font-medium">
                متوقع الإطلاق: {expectedDate}
              </p>
            </div>
          )} */}

          {/* Features preview */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>واجهة مستخدم محسنة</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>ميزات متقدمة</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>تجربة مستخدم سلسة</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              فهمت
            </button>
            {/* <button
              onClick={() => {
                // You can add notification signup functionality here
                console.log("Notify me clicked");
              }}
              className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              إشعارني عند الإطلاق
            </button> */}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-100 to-blue-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
      </div>
    </div>
  );
}
