// import { Course } from "@/types/dashboard";
import { apiService } from "./api";
import {
  API_CONFIG,
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  CoursesResponse,
  ApiResponse,
  // SelectedCoursesResponse,
} from "@/config/api";

export class CoursesService {
  async getAllCourses(params?: {
    search?: string;
    categoryId?: string;
  }): Promise<CoursesResponse> {
    try {
      const query = new URLSearchParams();
      if (params?.search?.trim()) query.append("search", params.search.trim());
      if (params?.categoryId) query.append("categoryId", params.categoryId);

      const endpoint = query.toString()
        ? `${API_CONFIG.ENDPOINTS.COURSES.GET_ALL}?${query.toString()}`
        : API_CONFIG.ENDPOINTS.COURSES.GET_ALL;

      const response = await apiService.get<CoursesResponse>(endpoint);

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to fetch courses");
      }
    } catch (error: any) {
      console.error("Get courses error:", error);
      throw error;
    }
  }

  async getSelectedCourses(): Promise<any> {
    try {
      const response = await apiService.get<any>(
        API_CONFIG.ENDPOINTS.COURSES.GET_SELECTED,
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to fetch courses");
      }
    } catch (error: any) {
      console.error("Get courses error:", error);
      throw error;
    }
  }

  // Create a new lead
  async createCourse(courseData: CreateCourseRequest): Promise<Course> {
    try {
      const response = await apiService.post<Course>(
        API_CONFIG.ENDPOINTS.COURSES.CREATE,
        courseData,
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to create course");
      }
    } catch (error: any) {
      console.error("Create course error:", error);
      throw error;
    }
  }

  // Update an existing lead
  async updateCourse(
    courseId: string,
    courseData: UpdateCourseRequest,
  ): Promise<Course> {
    try {
      const response = await apiService.put<Course>(
        `${API_CONFIG.ENDPOINTS.COURSES.UPDATE}/${courseId}`,
        courseData,
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to update course");
      }
    } catch (error: any) {
      console.error("Update course error:", error);
      throw error;
    }
  }

  // Delete a lead
  async deleteCourse(courseId: string): Promise<void> {
    try {
      const response = await apiService.delete(
        `${API_CONFIG.ENDPOINTS.COURSES.DELETE}/${courseId}`,
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to delete course");
      }
    } catch (error: any) {
      console.error("Delete course error:", error);
      throw error;
    }
  }
}

export const coursesService = new CoursesService();
