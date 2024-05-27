import {Injectable} from "@nestjs/common";
import {Prisma, Order} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class OrderRepository {
    constructor(private prisma: PrismaService) {
    }

    async createOrder(params: { data: Prisma.OrderCreateInput }): Promise<Order> {
        const {data} = params;
        return this.prisma.order.create({data});
    }

    async getOrders(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.OrderWhereUniqueInput;
        where?: Prisma.OrderWhereInput;
        orderBy?: Prisma.OrderOrderByWithRelationInput;
    }): Promise<Order[]> {
        const {skip, take, cursor, where, orderBy} = params;
        return this.prisma.order.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async updateOrder(params: {
        where: Prisma.OrderWhereUniqueInput;
        data: Prisma.OrderUpdateInput;
    }): Promise<Order> {
        const {where, data} = params;
        return this.prisma.order.update({
            data,
            where,
        });
    }

    async deleteOrder(params: { where: Prisma.OrderWhereUniqueInput }): Promise<Order> {
        const {where} = params;
        return this.prisma.order.delete({
            where,
        });
    }
}