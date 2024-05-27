import { Injectable, NotImplementedException } from "@nestjs/common";
import { UpdateOrderDto } from './dto/update-order.dto';
import {OrderDto} from "./dto/order.dto";
import {OrderRepository} from "./order.repository";
import {UserProductService} from "../user-product/user-product.service";
import {OrderStatus} from "@prisma/client";
import {UserService} from "../user/user.service";
import {CreateOrderDto} from "./dto/create-order.dto";
import {OrderDetailsService} from "../order-details/order-details.service";

@Injectable()
export class OrderService {
  constructor(private orderRepository: OrderRepository,
              private orderDetailsService: OrderDetailsService,
              private userProductService: UserProductService,
              private userService: UserService) {}
  async getAllOrders(): Promise<OrderDto[]> {
    return this.orderRepository.getOrders({})
  }

  async getOrderById(id: number): Promise<OrderDto> {
    return this.orderRepository.getOrders({where: {id}}).then(orders => orders[0]);
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderDto> {
    let user = await this.userService.getUserById(createOrderDto.userId);
    if (!user) {
      throw new Error('User not found');
    }
    let totalPrice = await this.userProductService.getTotalPriceForUser(createOrderDto.userId);
    let finalAddress = createOrderDto.address;
    if (!finalAddress == null) {
        finalAddress = user.address;
    } else if (finalAddress == user.address) {
        finalAddress = user.address;
    }
    let order = {
      user: { connect: { id: user.id } },
      address: finalAddress,
      totalPrice: totalPrice,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: OrderStatus.CREATED
    }
    let result = await this.orderRepository.createOrder({data: order});
    let enoughStockResult = await this.orderDetailsService.createOrderDetails(result.id, createOrderDto.userId);
    if (enoughStockResult == false) {
      let updatedOrder = {
        id: result.id,
        address: result.address,
        totalPrice: result.totalPrice,
        createdAt: result.createdAt,
        updatedAt: new Date(),
        status: OrderStatus.CANCELED
      }
        result = await this.orderRepository.updateOrder({where: {id: result.id}, data: updatedOrder});
    }
    await this.userProductService.deleteAllProductsFromCart(createOrderDto.userId);
    return result;
  }

  async updateOrderStatus(id: number, status: OrderStatus): Promise<OrderDto> {
    return this.orderRepository.updateOrder({where: {id}, data: {status, updatedAt: new Date()}});
  }

  async updateOrder(data: UpdateOrderDto): Promise<OrderDto> {
    return this.orderRepository.updateOrder({where: {id: data.id}, data: {address: data.address, updatedAt: new Date()}});
  }

  async deleteOrder(id: number): Promise<OrderDto> {
    await this.orderDetailsService.deleteOrderDetails(id);
    return this.orderRepository.deleteOrder({where: {id}});
  }

  getOrdersByUserId(userId: number) {
    let user = this.userService.getUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return this.orderRepository.getOrders({where: {userId}});
  }

  getOrderDetailsByOrderId(userId: number) {
    return this.orderDetailsService.getOrderDetailsByOrderId(userId);
  }
}
