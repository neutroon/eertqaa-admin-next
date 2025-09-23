"use client";

const popularCourses = [
  {
    id: "1",
    name: "تطوير الويب المتقدم",
    category: "التكنولوجيا",
    enrollments: 156,
    rating: 4.8,
    status: "active",
  },
  {
    id: "2",
    name: "إدارة المشاريع",
    category: "الإدارة",
    enrollments: 134,
    rating: 4.7,
    status: "active",
  },
  {
    id: "3",
    name: "التسويق الرقمي",
    category: "التسويق",
    enrollments: 128,
    rating: 4.6,
    status: "active",
  },
  {
    id: "4",
    name: "الذكاء الاصطناعي",
    category: "التكنولوجيا",
    enrollments: 112,
    rating: 4.9,
    status: "active",
  },
  {
    id: "5",
    name: "البرمجة بلغة Python",
    category: "التكنولوجيا",
    enrollments: 98,
    rating: 4.5,
    status: "active",
  },
];

export default function PopularCourses() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          الكورسات الأكثر شعبية
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {popularCourses.map((course, index) => (
          <div key={course.id} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <div className="mr-3">
                  <p className="text-sm font-medium text-gray-900">
                    {course.name}
                  </p>
                  <p className="text-sm text-gray-500">{course.category}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {course.enrollments} طالب
                  </p>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-500 mr-1">
                      {course.rating}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  نشط
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-3 bg-gray-50 rounded-b-lg">
        <a
          href="/dashboard/courses"
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          عرض جميع الكورسات →
        </a>
      </div>
    </div>
  );
}
