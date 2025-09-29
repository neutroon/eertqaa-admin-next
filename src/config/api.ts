// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "10000"),
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/api/v1/admin/login",
      REFRESH: "/api/v1/admin/refresh",
      LOGOUT: "/api/v1/admin/logout",
    },
    ADMIN: {
      PROFILE: "/api/v1/admin/profile",
    },
    LEADS: {
      GET_ALL: "/api/v1/leads",
      CREATE: "/api/v1/leads",
      UPDATE: "/api/v1/leads",
      DELETE: "/api/v1/leads",
    },
    COURSES: {
      GET_ALL: "/api/v1/courses",
      CREATE: "/api/v1/courses",
      UPDATE: "/api/v1/courses",
      DELETE: "/api/v1/courses",
    },
    CATEGORIES: {
      GET_ALL: "/api/v1/courses/categories",
      CREATE: "/api/v1/courses/categories",
      UPDATE: "/api/v1/courses/categories",
      DELETE: "/api/v1/courses/categories",
    },
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
  };
  timestamp?: string;
  statusCode?: number;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

// Leads Types
export interface Lead {
  id: string;
  name: string;
  phone: string;
  selectedProgram: string;
  learningPreference: string;
  message: string;
  voiceMessage: string;
  status: "pending" | "contacted" | "converted" | "rejected";
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadRequest {
  name: string;
  phone: string;
  selectedProgram: string;
  learningPreference: string;
  message: string;
  voiceMessage: string;
}

export interface UpdateLeadRequest {
  name: string;
  selectedProgram: string;
  learningPreference: string;
  message: string;
  status?: "pending" | "contacted" | "converted" | "rejected";
}

export interface UpdateLeadStatusRequest {
  status: "pending" | "contacted" | "converted" | "rejected";
}

export interface LeadsResponse extends ApiResponse {
  total: number;
  leads: Lead[];
}

// Courses Types
export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  courses: Course[];
}

export interface CategoryResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  courses: Course[];
}
// export interface CategoriesResponse {
//   total: number;
//   categories: Category[];
// }
// [
//   {
//     id: "b9d223bd-2d31-4384-8f5a-43d2f65bb6f3",
//     name: "first category",
//     createdAt: "2025-09-27T00:51:10.334Z",
//     updatedAt: "2025-09-27T00:51:10.334Z",
//     courses: [
//       {
//         id: "ce47888e-1f7f-482c-8456-4fac5b3551c1",
//         title: "fdadf",
//         description: "fdssdf",
//         price: 3,
//         imageUrl: "fsdfd",
//         categoryId: "b9d223bd-2d31-4384-8f5a-43d2f65bb6f3",
//         summary: "fdsfs",
//         duration: 3,
//         availableSeats: 4,
//         createdAt: "2025-09-27T00:56:23.847Z",
//         updatedAt: "2025-09-27T00:56:23.847Z",
//       },
//     ],
//   },
// ];
export interface Course {
  id: string;
  title: string;
  description: string;
  status: "active" | "inactive" | "completed";
  category: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };

  price: number;
  imageUrl: string;
  categoryId: string;
  summary: string;
  duration: number;
  availableSeats: number;
  createdAt: string;
  updatedAt: string;
  features: {
    id: string;
    name: string;
    courseId: string;
    createdAt: string;
    updatedAt: string;
  }[];
}
export interface CreateCourseRequest {
  title: string;
  summary: string;
  duration: number;
  availableSeats: number;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  features: string[];
}
// status
export interface UpdateCourseRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  summary: string;
  duration: number;
  availableSeats: number;
}
export interface CoursesResponse {
  total: number;
  courses: Course[];
}
// Error Types
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public error?: { code: string }
  ) {
    super(message);
    this.name = "ApiError";
  }
}
