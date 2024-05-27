import { Injectable, NotImplementedException } from "@nestjs/common";
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {ProductDto} from "./dto/product.dto";
import {ProductRepository} from "./product.repository";
import {CategoryRepository} from "../category/category.repository";

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository,
              private categoryRepository: CategoryRepository) {}

  async getAllProducts(): Promise<ProductDto[]> {
    return await this.productRepository.getProducts({});
  }
  async getProductById(id: number): Promise<ProductDto> {
    return await this.productRepository.getProductById(id);
  }

  async createProduct(data: CreateProductDto): Promise<ProductDto> {
    let category = await this.categoryRepository.getCategories({where: {id: data.categoryId}});
    if (category.length === 0) {
      throw new NotImplementedException('Category not found');
    }
    let product = {
        name: data.name,
        photo: data.photo,
        description: data.description,
        price: data.price,
        stock: data.stock,
        category: { connect: { id: data.categoryId } }

    }
    return await this.productRepository.createProduct({data: product});
  }
  async updateProduct(data: UpdateProductDto): Promise<ProductDto> {
    let category = await this.categoryRepository.getCategories({where: {id: data.categoryId}});
    if (category.length === 0) {
      throw new NotImplementedException('Category not found');
    }
    let product = {
      name: data.name,
      photo: data.photo,
      description: data.description,
      price: data.price,
      stock: data.stock,
      category: { connect: { id: data.categoryId } }
    }
    return await this.productRepository.updateProduct({where: {id: data.id}, data: product});
  }
  async deleteProduct(id: number): Promise<ProductDto> {
    return await this.productRepository.deleteProduct({where: {id}});
  }
}
