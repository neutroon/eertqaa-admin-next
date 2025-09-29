// import { Course } from "@/types/dashboard";
import { apiService } from "./api";
import {
  API_CONFIG,
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  CoursesResponse,
  ApiResponse,
} from "@/config/api";

export class CoursesService {
  // Get all leads
  async getAllCourses(): Promise<CoursesResponse> {
    try {
      const response = await apiService.get<CoursesResponse>(
        API_CONFIG.ENDPOINTS.COURSES.GET_ALL
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
        courseData
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
    courseData: UpdateCourseRequest
  ): Promise<Course> {
    try {
      const response = await apiService.put<Course>(
        `${API_CONFIG.ENDPOINTS.COURSES.UPDATE}/${courseId}`,
        courseData
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
        `${API_CONFIG.ENDPOINTS.COURSES.DELETE}/${courseId}`
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
