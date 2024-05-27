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
  UseGuards,
  Req,
  Put
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import {ProductDto} from "./dto/product.dto";
import {Response} from "express";
import {Request} from "express";
import {TimingInterceptor} from "../interceptor";
import {AuthService} from "../auth/auth.service";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Roles} from "../auth/roles.decorator";
import {Role} from "@prisma/client";
import {WebsocketGateway} from "../websocket/websocket.gateway";

@ApiTags('product')
@Controller('product')
@UseInterceptors(TimingInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService,
              private authService: AuthService,
              private websocketGateway: WebsocketGateway) {}

  @Get()
  @ApiOperation({
    summary: 'Get all products',
  })
  @ApiResponse({
    status: 201,
    description: 'The found records',
    type: [ProductDto],
  })
  @ApiResponse({
    status: 404,
    description: "No records found",
  })
  async getAllProducts() {
    return this.productService.getAllProducts();
  }
  @Get(':id')
  // @ApiParam({ name: 'id', type: 'number' })
  @ApiOperation({
    summary: 'Get product by id',
  })
  @ApiResponse({
    status: 201,
    description: 'OK',
    type: ProductDto,
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  async getProductById(@Param('id') id: string, @Res() res: Response, @Req() req: Request) {
    // return this.productService.getProductById(+id);
    let productContent = await this.productService.getProductById(+id);
    let photoPath = productContent.photo;
    const edition = '../../';
    productContent.photo = edition + photoPath;
    const cookie = req.cookies['jwt'];
    let user = await this.authService.getUserFromToken(cookie);
    if (user.role === Role.ADMIN) {
      return res.render('productPageAdmin', {
        layout: 'layout',
        style: '../../style.css',
        loadTimeScript: '../../loadTime.js',
        id: productContent.id,
        name: productContent.name,
        photo: productContent.photo,
        description: productContent.description,
        price: productContent.price,
        stock: productContent.stock,
        autoTopScrollButton: '../../autoTopScrollButton.js',
        activePage: '../../activePage.js',
        subscribeScript: '../../subscribeScript.js',
        productPageScript: '../../productPageScript.js',
        productPageDeleteScript: '../../productPageDeleteScript.js',
        websocketScript: '../../websocketScript.js'
      });
    } else {
      return res.render('productPage', {
        layout: 'layout',
        style: '../../style.css',
        loadTimeScript: '../../loadTime.js',
        id: productContent.id,
        name: productContent.name,
        photo: productContent.photo,
        description: productContent.description,
        price: productContent.price,
        stock: productContent.stock,
        autoTopScrollButton: '../../autoTopScrollButton.js',
        activePage: '../../activePage.js',
        subscribeScript: '../../subscribeScript.js',
        productPageScript: '../../productPageScript.js',
        websocketScript: '../../websocketScript.js'
      });
    }
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('edit/:id')
  // @ApiParam({ name: 'id', type: 'number' })
  @ApiOperation({
    summary: 'Get product by id for editing',
  })
  @ApiResponse({
    status: 201,
    description: 'OK',
    type: ProductDto,
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  async getEditProductPage(@Param('id') id: string, @Res() res: Response) {
    let productContent = await this.productService.getProductById(+id);
    let photoPath = productContent.photo;
    const edition = '../../';
    productContent.photo = edition + photoPath;
    return res.render('productEditPage', {
      layout: 'layout',
      style: '../../style.css',
      loadTimeScript: '../../loadTime.js',
      id: productContent.id,
      name: productContent.name,
      photo: productContent.photo,
      description: productContent.description,
      price: productContent.price,
      stock: productContent.stock,
      categoryId: productContent.categoryId,
      autoTopScrollButton: '../../autoTopScrollButton.js',
      activePage: '../../activePage.js',
      subscribeScript: '../../subscribeScript.js',
      websocketScript: '../../websocketScript.js',
      editProductScript: '../../editProductScript.js'
    });
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  // @ApiCreatedResponse({ type: ProductDto })
  // @ApiParam({ name: 'CreateProductDto', type: CreateProductDto })
  @ApiOperation({
    summary: 'Create a new product.',
  })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  @ApiBody({ type: CreateProductDto })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    let product = await this.productService.createProduct(createProductDto);
    this.websocketGateway.notifyProductCreation(product);
    return product;
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put()
  // @ApiParam({ name: 'updateProductDto', type: UpdateProductDto })
  @ApiOperation({
    summary: 'Update product by id',
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully updated.',
    type: ProductDto,
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  @ApiBody({ type: UpdateProductDto })
  async updateProduct(@Body() updateProductDto: UpdateProductDto) {
    // return this.productService.updateProduct(updateProductDto);
    let product = await this.productService.updateProduct(updateProductDto);
    this.websocketGateway.notifyProductUpdate(product);
    return product;
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete product by id',
  })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully deleted.',
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  async deleteProduct(@Param('id') id: string) {
    // return this.productService.deleteProduct(+id);
    let currProduct = await this.productService.getProductById(+id);
    let productId = await this.productService.deleteProduct(+id);
    this.websocketGateway.notifyProductDeletion(currProduct);
    return productId;
  }
}
