import { UserRole } from "@/contexts/AuthContext";
export { UserRole };

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "10000"),
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/api/v1/auth/login",
      REFRESH: "/api/v1/auth/refresh",
      LOGOUT: "/api/v1/auth/logout",
      PROFILE: "/api/v1/auth/profile",
    },

    LEADS: {
      GET_ALL: "/api/v1/leads",
      GET_BY_ID: "/api/v1/leads",
      STATS: "/api/v1/leads/stats",
      CREATE: "/api/v1/leads",
      UPDATE: "/api/v1/leads",
      DELETE: "/api/v1/leads",
      CLAIM: "/api/v1/leads/claim",
    },
    COURSES: {
      GET_ALL: "/api/v1/courses",
      GET_SELECTED: "/api/v1/courses/selected",
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
    USERS: {
      LIST: "/api/v1/users/list",
      CREATE: "/api/v1/users",
      GET_BY_ID: "/api/v1/users",
      UPDATE: "/api/v1/users",
      TOGGLE_STATUS: "/api/v1/users",
      DELETE: "/api/v1/users",
      ONLINE_USERS: "/api/v1/users/online",
      ONLINE_SALES_AGENTS: "/api/v1/users/online/sales-agents",
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
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
export interface selectedProgram {
  id?: string;
  name: string;
  courseId?: string;
}

// Lead source type
export type LeadSource =
  | "Cairo University"
  | "Ain Shams University"
  | "messenger"
  | "whatsapp";

// Leads Types
export interface Lead {
  id: string;
  name: string;
  phone: string;
  selectedProgram: selectedProgram;
  learningPreference: string;
  message: string;
  voiceMessage: string;
  status: "pending" | "contacted" | "converted" | "rejected";
  source?: LeadSource;
  createdAt: string;
  updatedAt: string;
  isLocked: boolean;
  lockedAt: string | null;
  lockedBy: string | null;
  lastContactedAt: string | null;
  assignedToSales: {
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
    };
  } | null;
  assignedToSalesId: string | null;
  assignedBy: string | null;
  assignedAt: string | null;
  adminNote: string | null;
  countryCode: string | null;
  feedbacks: LeadFeedback[];
  _count: {
    feedbacks: number;
  };
}

export interface LeadFeedback {
  id: string;
  leadId: string;
  csAgentId: string;
  callOutcome:
    | "answered"
    | "no-answer"
    | "busy"
    | "wrong-number"
    | "interested"
    | "not-interested";
  notes: string;
  nextFollowUpDate: string | null;
  createdAt: string;
  updatedAt: string;
  csAgent?: {
    user: {
      id: string;
      name: string;
    };
  };
}

export interface AddLeadFeedbackRequest {
  leadId: string;
  csAgentId: string;
  callOutcome: string;
  notes: string;
  nextFollowUpDate?: string;
}

export interface CreateLeadRequest {
  name: string;
  phone: string;
  selectedProgram: selectedProgram;
  learningPreference: string;
  message: string;
  voiceMessage: string;
}

export interface UpdateLeadRequest {
  name: string;
  selectedProgram: selectedProgram;
  learningPreference: string;
  message: string;
  status?: "pending" | "contacted" | "converted" | "rejected";
}

export interface UpdateLeadStatusRequest {
  status: "pending" | "contacted" | "converted" | "rejected";
}

export interface LeadsResponse extends ApiResponse {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
  leads: Lead[];
}

export interface LeadsStatsResponse extends ApiResponse {
  totalLeads: number;
  newLeadsThisMonth: number;
  pendingLeads: number;
  contactedLeads: number;
  rejectedLeads: number;
  convertedLeads: number;
  claimedLeads: number;
  unclaimedLeads: number;
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
export interface SelectedCourse {
  selectedPrograms: {
    id: string;
    name: string;
    courseId: string;
    _count: {
      leads: number;
    };
  }[];
  total: number;
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
// export interface SelectedCoursesResponse {
//   total: number;
//   selectedPrograms: SelectedCourse[];
// }
// Error Types
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public error?: { code: string },
  ) {
    super(message);
    this.name = "ApiError";
  }
}
