"use client";

import { SelectedCourse } from "@/config/api";




export default function PopularCourses(selectedPrograms: SelectedCourse) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <h3 className="text-lg font-semibold text-gray-900">البرامج الأكثر شعبية</h3>
        <p className="text-sm text-gray-500 mt-1">البرامج الأكثر طلباً من العملاء</p>
      </div>

      {selectedPrograms.total === 0 ? (
        <div className="px-6 py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">لا توجد بيانات متاحة</p>
          <p className="text-sm text-gray-400 mt-1">سيظهر هنا البرامج الأكثر شعبية</p>
        </div>
      ) : (
        <div className="grico id grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-6">
          {selectedPrograms.selectedPrograms.map((course, index) => (
            <div
              key={course.id}
              className="group relative bg-gradient-to-br from-gray-50 to-white rounded-lg p-5 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Rank Badge */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-bold">{index + 1}</span>
              </div>

              <div className="mt-2">
                <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[40px]">
                  {course.name}
                </h4>
                {/* <p className="text-xs text-gray-500 mb-3">{course.category.name}</p> */}

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-1">
                    {/* <span className="text-xs font-medium text-gray-700">{course.price} EGP</span> */}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{selectedPrograms.selectedPrograms[index]._count.leads}</p>
                    <p className="text-xs text-gray-500">متدرب</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <a
          href="/dashboard/courses"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center group"
        >
          عرض جميع البرامج
          <svg className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </a>
      </div>
    </div>
  );
}
