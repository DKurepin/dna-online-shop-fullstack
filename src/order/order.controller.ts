import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, Res, UseInterceptors, HttpStatus, UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import {OrderDto} from "./dto/order.dto";
import {CreateProductDto} from "../product/dto/create-product.dto";
import {UpdateProductDto} from "../product/dto/update-product.dto";
import {CreateOrderDto} from "./dto/create-order.dto";
import {OrderStatus, Role} from "@prisma/client";
import {OrderDetailsService} from "../order-details/order-details.service";
import {Response} from "express";
import {Request} from "express";
import {TimingInterceptor} from "../interceptor";
import {AuthService} from "../auth/auth.service";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Roles} from "../auth/roles.decorator";

@ApiTags('order')
@Controller('order')
@UseInterceptors(TimingInterceptor)
export class OrderController {
  constructor(private readonly orderService: OrderService,
              private orderDetailsService: OrderDetailsService,
              private authService: AuthService) {}

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({
    summary: 'Get all orders',
  })
  @ApiResponse({
    status: 201,
    description: 'The found records',
    type: [OrderDto],
  })
  @ApiResponse({
    status: 404,
    description: "No records found",
  })
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  // @ApiParam({ name: 'id', type: 'number' })
  @ApiOperation({
    summary: 'Get order by id',
  })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: OrderDto,
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  async getOrderById(@Param('id') id: string, @Res() res: Response) {
    // return this.orderService.getOrderById(+id);
    let order = await this.orderService.getOrderById(+id);
    let orderDetails = await this.orderDetailsService.getOrderDetailsByOrderId(+id);
    console.log('orderDetails', orderDetails);
    console.log('order', order);
    return res.render('orderPage', {
        layout: 'layout',
        style: '../../account.css',
        userId: order.userId,
        id: order.id,
        status: order.status,
        address: order.address,
        total: order.totalPrice,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        products: orderDetails,
        loadTimeScript: '../../loadTime.js',
        autoTopScrollButton: '../../autoTopScrollButton.js',
        subscribeScript: '../../subscribeScript.js',
      webSocketScript: '../../webSocketScript.js'
    });
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Post()
  // @ApiCreatedResponse({ type: OrderDto })
  // @ApiParam({ name: 'CreateOrderDto', type: CreateOrderDto })
  @ApiOperation({
    summary: 'Create a new order',
  })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  @ApiBody({ type: CreateOrderDto })
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Res() res: Response) {
    let order = await this.orderService.createOrder(createOrderDto);
    return res.status(HttpStatus.CREATED).send(order);
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Patch(':id')
  // @ApiParam({ name: 'UpdateOrderDto', type: UpdateOrderDto })
  @ApiOperation({
    summary: 'Update order by id',
  })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully updated.',
    type: OrderDto,
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  @ApiBody({ type: UpdateOrderDto })
  async updateOrder(
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.updateOrder(updateOrderDto);
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/status')
  // @ApiParam({ name: 'UpdateOrderDto', type: UpdateOrderDto })
  @ApiOperation({
    summary: 'Update order by id',
  })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully updated.',
    type: OrderDto,
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  @ApiBody({ type: UpdateOrderDto })
  async updateOrderStatus(@Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.updateOrderStatus(updateOrderDto.id, updateOrderDto.status);
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiOperation({
    summary: 'Delete order by id',
  })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully deleted.',
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  async deleteOrder(@Param('id') id: string) {
    return this.orderService.deleteOrder(+id);
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Get('user/:id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiOperation({
    summary: 'Get orders by user id',
  })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: [OrderDto],
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  async getOrdersByUserId(@Param('id') id: string) {
    return this.orderService.getOrdersByUserId(+id);
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Get(':id/details')
  // @ApiParam({ name: 'id', type: 'number' })
  @ApiOperation({
    summary: 'Get order details by order id',
  })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    // type: [OrderDetails],
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  async getOrderDetailsByOrderId(@Param('id') id: string) {
    return this.orderService.getOrderDetailsByOrderId(+id);
  }
}
