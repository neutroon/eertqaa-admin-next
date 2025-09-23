export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  duration: number; // in hours
  price: number;
  capacity: number;
  enrolled: number;
  status: "active" | "inactive" | "completed";
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  popularity: number;
  rating: number;
  requirements: string[];
  learningOutcomes: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  courseCount: number;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: "male" | "female";
  nationality: string;
  city: string;
  address: string;
  educationLevel: string;
  workExperience: string;
  selectedCourses: string[];
  learningPreference: "online" | "offline" | "hybrid";
  registrationDate: Date;
  status: "pending" | "approved" | "enrolled" | "completed" | "cancelled";
  notes: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Testimonial {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
  isFeatured: boolean;
}

export interface AnalyticsData {
  totalCourses: number;
  totalStudents: number;
  totalRegistrations: number;
  activeCourses: number;
  completedCourses: number;
  monthlyRegistrations: Array<{
    month: string;
    count: number;
  }>;
  popularCategories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  coursePopularity: Array<{
    courseId: string;
    courseName: string;
    views: number;
    enrollments: number;
  }>;
  filterUsage: Array<{
    filter: string;
    usageCount: number;
  }>;
}

export interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalRegistrations: number;
  activeCourses: number;
  completedCourses: number;
  pendingRegistrations: number;
  monthlyGrowth: number;
  averageRating: number;
}
