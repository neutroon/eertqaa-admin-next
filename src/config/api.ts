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

export interface LeadsResponse {
  total: number;
  leads: Lead[];
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
