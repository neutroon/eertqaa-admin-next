"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Course, Category, UserRole } from "@/config/api";
import { coursesService } from "@/services/courses";
import { categoriesService } from "@/services/categories";
import { 
  BookOpenIcon as BookOpen, 
  PlusIcon as Plus, 
  TagIcon as Tags, 
  MagnifyingGlassIcon as Search, 
  FunnelIcon as Filter, 
  ArrowPathIcon as ArrowPath, 
  AcademicCapIcon as AcademicCap,
  BriefcaseIcon as Briefcase,
  Square3Stack3DIcon as Layers,
  ArrowRightIcon as ArrowRight
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CourseModal from "@/components/dashboard/courses/CourseModal";
import CategoryModal from "@/components/dashboard/courses/CategoryModal";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Pencil, Trash2, MoreVertical, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CoursesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);

      const [coursesRes, categoriesRes] = await Promise.all([
        coursesService.getAllCourses(),
        categoriesService.getAllCategories()
      ]);

      setCourses(coursesRes.courses);
      setCategories(categoriesRes);
    } catch (error) {
      console.error("Failed to load courses data:", error);
      toast.error("حدث خطأ أثناء تحميل البيانات");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا البرنامج؟")) {
      try {
        await coursesService.deleteCourse(courseId);
        toast.success("تم حذف البرنامج بنجاح");
        loadData(true);
      } catch (error) {
        toast.error("فشل في حذف البرنامج");
      }
    }
  };

  // Role check: Only ADMIN can manage courses
  if (user && user.role !== UserRole.ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
        <div className="h-24 w-24 rounded-3xl bg-red-50 flex items-center justify-center text-red-500 shadow-inner">
          <ShieldAlert className="h-12 w-12" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">غير مصرح لك بالدخول</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            هذه الصفحة مخصصة لمديري النظام فقط لإدارة البرامج التعليمية.
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard")} className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8">
          العودة للرئيسية
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-br from-indigo-600 to-blue-700 p-6 md:p-8 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <AcademicCap className="h-8 w-8" />
            إدارة البرامج التعليمية
          </h1>
          <p className="text-indigo-100 font-medium">إدارة الدورات التدريبية والبرامج المهنية والفئات</p>
        </div>
        <div className="flex gap-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              className="bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl px-6 py-6 font-bold shadow-lg gap-2 border-none"
              onClick={() => {
                setEditingCourse(null);
                setShowCourseModal(true);
              }}
            >
              <Plus className="h-5 w-5" />
              برنامج جديد
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              variant="outline"
              className="bg-indigo-500/30 border-white/20 hover:bg-indigo-500/50 text-white rounded-xl px-6 py-6 font-bold shadow-lg gap-2"
              onClick={() => setShowCategoryModal(true)}
            >
              <Tags className="h-5 w-5" />
              إدارة الفئات
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-200/50 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">إجمالي البرامج</p>
            <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200/50 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">الفئات التعليمية</p>
            <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200/50 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">البرامج النشطة</p>
            <p className="text-2xl font-bold text-gray-900">{courses.filter(c => c.status === 'active').length}</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/50 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              placeholder="ابحث عن اسم البرنامج..." 
              className="pr-10 h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button 
              variant="outline" 
              className={cn(
                "h-12 rounded-xl px-4 gap-2 transition-all",
                showFilters ? "bg-indigo-50 border-indigo-200 text-indigo-600" : ""
              )}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5" />
              تصفية
            </Button>
            <Button 
              variant="outline"
              className="h-12 rounded-xl px-4 gap-2"
              onClick={() => loadData(true)}
              disabled={isRefreshing}
            >
              <ArrowPath className={cn("h-5 w-5", isRefreshing && "animate-spin")} />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                <button 
                  onClick={() => setSelectedCategory("all")}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    selectedCategory === "all" ? "bg-indigo-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  الكل
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                      selectedCategory === cat.name ? "bg-indigo-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
        <Table dir="rtl">
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="text-right py-4">البرنامج</TableHead>
              <TableHead className="text-right">الفئة</TableHead>
              <TableHead className="text-right">المدة</TableHead>
              <TableHead className="text-right">المقاعد</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-left">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex justify-center items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    <span className="text-gray-500 font-medium">جاري تحميل البرامج...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCourses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center text-gray-500">
                  لا توجد برامج تطابق بحثك
                </TableCell>
              </TableRow>
            ) : (
              filteredCourses.map((course) => (
                <TableRow key={course.id} className="group hover:bg-gray-50/50 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white shrink-0 shadow-sm overflow-hidden">
                        {course.imageUrl ? (
                          <img src={course.imageUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <BookOpen className="h-6 w-6" />
                        )}
                      </div>
                      <div className="max-w-xs md:max-w-md">
                        <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                          {course.title}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1">{course.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100 rounded-lg px-2.5">
                      {course.category?.name || "غير محدد"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-gray-600">{course.duration} شهر</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-gray-900">{course.availableSeats} مقعد</span>
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all",
                            course.availableSeats === 0 ? "bg-red-500" : "bg-emerald-500"
                          )}
                          style={{ width: `${Math.min((course.availableSeats / 20) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "rounded-lg px-2.5 border-none shadow-sm",
                      course.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    )}>
                      {course.status === 'active' ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 w-9 p-0 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl"
                        onClick={() => {
                          setEditingCourse(course);
                          setShowCourseModal(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 w-9 p-0 hover:bg-red-50 hover:text-red-600 rounded-xl"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      {showCourseModal && (
        <CourseModal
          course={editingCourse}
          onClose={() => {
            setShowCourseModal(false);
            setEditingCourse(null);
          }}
          categories={categories}
          onCourseCreated={() => {
            loadData(true);
            setShowCourseModal(false);
          }}
          onCourseUpdated={() => {
            loadData(true);
            setShowCourseModal(false);
          }}
          onRefresh={() => loadData(true)}
        />
      )}

      {showCategoryModal && (
        <CategoryModal
          onClose={() => setShowCategoryModal(false)}
          categories={categories}
          onCategoryCreated={() => loadData(true)}
          onCategoryDeleted={() => loadData(true)}
          onRefresh={() => loadData(true)}
        />
      )}
    </div>
  );
}
