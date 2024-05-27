import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseInterceptors,
  Render,
  UseGuards
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import {CategoryDto} from "./dto/category.dto";
import {Response} from "express";
import {Request} from "express";
import {TimingInterceptor} from "../interceptor";
import {AuthService} from "../auth/auth.service";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Roles} from "../auth/roles.decorator";
import {Role} from "@prisma/client";

@ApiTags('category')
@Controller('category')
@UseInterceptors(TimingInterceptor)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService,
              private authService: AuthService) {}


  @Get()
  @ApiOperation({
    summary: 'Get all categories',
  })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: [CategoryDto],
  })
  @ApiResponse({
    status: 404,
    description: "No records found",
  })
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiOperation({
    summary: 'Get category by id',
  })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: CategoryDto,
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(+id);
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  // @ApiCreatedResponse({ type: CategoryDto })
  // @ApiParam({ name: 'CreateCategoryDto', type: CreateCategoryDto })
  @ApiOperation({
    summary: 'Create a new category.',
  })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  @ApiBody({ type: CreateCategoryDto })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  // @ApiParam({ name: 'UpdateCategoryDto', type: UpdateCategoryDto })
  @ApiOperation({
    summary: 'Update a category by id.',
  })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: CategoryDto,
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  @ApiBody({ type: UpdateCategoryDto })
  async updateCategory(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.updateCategory(updateCategoryDto);
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete category by id.',
  })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
    type: CategoryDto,
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(+id);
  }

  @Get(':id/products')
  @ApiOperation({
    summary: 'Get products by category id.',
  })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: [CategoryDto],
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  async getProductsByCategoryId(@Param('id') id: string, @Res() res: Response) {
    let categoryContent =  await this.categoryService.getProductsByCategoryId(+id);
    let products = categoryContent.products;
    // change path for photo
    for (let product of products) {
      let path = product.photo;
      const edition = '../../';
      product.photo = edition + path;
    }
    console.log(products)
    return res.render('index', {
        layout: 'layout',
        style: '../../style.css',
        loadTimeScript: '../../loadTime.js',
        products: products,
        autoTopScrollButton: '../../autoTopScrollButton.js',
        activePage: '../../activePage.js',
        subscribeScript: '../../subscribeScript.js',
        websocketScript: '../../websocketScript.js'
    });
  }
}
