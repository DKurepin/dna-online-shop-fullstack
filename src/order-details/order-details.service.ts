import { Injectable, NotImplementedException } from "@nestjs/common";
import { PrismaService } from '../prisma.service';
import {OrderDetailsRepository} from "./order-details.repository";
import {ProductRepository} from "../product/product.repository";
import {UserProductRepository} from "../user-product/user-product.repository";
import {ProductService} from "../product/product.service";
import {UserProductService} from "../user-product/user-product.service";
import any = jasmine.any;

@Injectable()
export class OrderDetailsService {
  constructor(private orderDetailsRepository: OrderDetailsRepository,
              private productRepository: ProductRepository,
              private userProductRepository: UserProductRepository,
              private userProductService: UserProductService,
              private productService: ProductService) {}


  async createOrderDetails(orderId: number, userId: number) {
    let products = await this.userProductService.getProductsByUserId(userId);
    console.log('products', products);
    let enoughStock = true;
    for (let product of products) {
      let productData = await this.productService.getProductById(product.productId);
      if (productData.stock < product.quantity) {
            enoughStock = false;
      }
      let unitPrice = productData.price;
      let totalPrice = unitPrice * product.quantity;
      let orderDetail = {
        order: { connect: { id: orderId } },
        product: { connect: { id: product.productId } },
        quantity: product.quantity,
        unitPrice: unitPrice,
        totalPrice: totalPrice
      }
      await this.orderDetailsRepository.createOrderDetails({data: orderDetail})
    }
    if (enoughStock == true) {
        for (let product of products) {
            let productData = await this.productService.getProductById(product.productId);
            let newQuantity = productData.stock - product.quantity;
            let res = await this.productRepository.updateProduct({where: {id: product.productId}, data: {stock: newQuantity}});
            console.log('res', res);
        }
    }
    return enoughStock;
  }

  async getOrderDetailsByOrderId(orderId: number) {
      return await this.orderDetailsRepository.getOrderDetails({where: {orderId}});
  }
  async deleteOrderDetails(orderId: number) {
      let orderDetails = await this.orderDetailsRepository.getOrderDetails({where: {orderId}});
        for (let orderDetail of orderDetails) {
            await this.orderDetailsRepository.deleteOrderDetails({where: {id: orderDetail.id}});
        }
  }
}
