import { Injectable, NotImplementedException } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import {CategoryRepository} from "./category.repository";
import {CategoryDto} from "./dto/category.dto";

@Injectable()
export class CategoryService {

  constructor(private categoryRepository: CategoryRepository) {
  }
  async getAllCategories(): Promise<CategoryDto[]> {
    return this.categoryRepository.getCategories({});
  }
  async getCategoryById(id: number): Promise<CategoryDto> {
    return this.categoryRepository.getCategories({where: {id}}).then(categories => categories[0]);
  }
  async createCategory(data: CreateCategoryDto): Promise<CategoryDto> {
    return this.categoryRepository.createCategory({data});
  }
  async updateCategory(data: UpdateCategoryDto): Promise<CategoryDto> {
    return this.categoryRepository.updateCategory({where: {id: data.id}, data});
  }

  async deleteCategory(id: number): Promise<CategoryDto> {
    return this.categoryRepository.deleteCategory({where: {id}});
  }

  getProductsByCategoryId(id: number) {
    return this.categoryRepository.getProductsByCategoryId(id);
  }
}
