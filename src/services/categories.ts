import { apiService } from "./api";
import { API_CONFIG, Category } from "@/config/api";

export class CategoriesService {
  async getAllCategories(): Promise<Category[]> {
    const response = await apiService.get<Category[]>(
      API_CONFIG.ENDPOINTS.CATEGORIES.GET_ALL
    );
    console.log(response);
    if (response.success) {
      return response.data || [];
    } else {
      throw new Error(response.message || "Failed to fetch categories");
    }
  }
  async createCategory(categoryData: Category): Promise<Category> {
    const response = await apiService.post<Category>(
      API_CONFIG.ENDPOINTS.CATEGORIES.CREATE,
      categoryData
    );
    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || "Failed to create category");
    }
  }
  async deleteCategory(categoryId: string): Promise<void> {
    const response = await apiService.delete<void>(
      `${API_CONFIG.ENDPOINTS.CATEGORIES.DELETE}/${categoryId}`
    );
    if (response.success) {
      return;
    } else {
      throw new Error(response.message || "Failed to delete category");
    }
  }
}
export const categoriesService = new CategoriesService();
