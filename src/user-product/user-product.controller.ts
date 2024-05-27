import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post, Req,
  Res,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { UserProductService } from './user-product.service';
import {ApiBody, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateUserProductDto} from "./dto/create-user-product.dto";
import {UserProductDto} from "./dto/user-product.dto";
import {UpdateUserProductDto} from "./dto/update-user-product.dto";
import { Response } from 'express';
import { Request } from 'express';
import {ProductService} from "../product/product.service";
import {UserService} from "../user/user.service";
import {TimingInterceptor} from "../interceptor";
import {AuthService} from "../auth/auth.service";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Roles} from "../auth/roles.decorator";
import {Role} from "@prisma/client";


@Controller('user-product')
@ApiTags('user-product')
@UseInterceptors(TimingInterceptor)
export class UserProductController {
  constructor(private readonly userProductService: UserProductService,
              private productService: ProductService,
              private userService: UserService,
              private authService: AuthService) {}

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Post()
  @ApiOperation({
    summary: 'Add product to user cart.',
  })
  @ApiResponse({
    status: 201,
    description: 'Product has been successfully added to user cart.',
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  @ApiBody({ type: CreateUserProductDto })
  async addProductToCart(@Body() data: CreateUserProductDto, @Req() req: Request, @Res() res: Response) {
    const token = req.cookies.jwt;
    // if (token !== undefined) {
    //   let user = await this.authService.getUserFromToken(token);
    //     data.userId = user.id;
    //     await this.userProductService.addProductToCart(data);
    //     res.status(HttpStatus.OK).send();
    // }
    // else {
    //     res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized access.' });
    // }
    try {
      let user = await this.authService.getUserFromToken(token);
      data.userId = user.id;
      await this.userProductService.addProductToCart(data);
      res.status(HttpStatus.OK).send();
    }
    catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to add product to cart.' });
    }
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Patch()
  // @ApiParam({ name: 'updateProductDto', type: UpdateProductDto })
  @ApiOperation({
    summary: 'Update product.',
  })
  @ApiResponse({
    status: 201,
    description: 'Product has been successfully updated.',
    type: UserProductDto,
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  @ApiBody({ type: UpdateUserProductDto })
  async updateProduct(@Body() data: UpdateUserProductDto) {
    return this.userProductService.updateProduct(data);
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete cart product.',
  })
  @ApiResponse({
    status: 201,
    description: 'Product has been successfully deleted.',
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  async deleteProductFromCart(@Param('id') id: string) {
    return this.userProductService.deleteProductFromCart(+id);
  }


  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get(':id')
  // @ApiParam({ name: 'id', type: 'number' })
  @ApiOperation({
    summary: 'Get user products cart by user id.',
  })
  @ApiResponse({
    status: 201,
    description: 'OK',
    type: UserProductDto,
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  async getProductsByUserId(@Param('id') id: string, @Res() res: Response) {
    // return this.userProductService.getProductsByUserId(+id);
    let products = await this.userProductService.getProductsByUserId(+id);
    let productInfo = [];
    for (let i = 0; i < products.length; i++) {
        let product = await this.productService.getProductById(products[i].productId);
        productInfo.push({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            categoryId: product.categoryId,
            photo: product.photo,
            quantity: products[i].quantity,
            userProductId: products[i].id
        });
    }
    let user = await this.userService.getUserById(+id);
    let totalPrice = await this.userProductService.getTotalPriceForUser(+id);
    console.log("totalPrice: ", totalPrice);
    return res.render('cartContent', {
        layout: 'layout',
        style: '../cart.css',
        productInfo: productInfo,
        cartTotal: totalPrice,
        loadTimeScript: '../loadTime.js',
        autoTopScrollButton: '../autoTopScrollButton.js',
        userId: id,
        userAddress: user.address,
        subscribeScript: '../subscribeScript.js',
        cartContentDeleteScript: '../cartContentDeleteScript.js',
        cartContentNewOrderScript: '../cartContentNewOrderScript.js',
      webSocketScript: '../webSocketScript.js'
    });

  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id/total-price')
  @ApiOperation({
    summary: 'Get total price for user cart.',
  })
  @ApiResponse({
    status: 201,
    description: 'OK',
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
    async getTotalPriceForUser(@Param('id') id: string) {
    return this.userProductService.getTotalPriceForUser(+id);
  }
}
