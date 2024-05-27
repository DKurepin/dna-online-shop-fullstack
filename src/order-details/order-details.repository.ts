import {Injectable} from "@nestjs/common";
import {Prisma, OrderDetails} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class OrderDetailsRepository {
    constructor(private prisma: PrismaService) {
    }

    async createOrderDetails(params: { data: Prisma.OrderDetailsCreateInput }): Promise<OrderDetails> {
        const {data} = params;
        return this.prisma.orderDetails.create({data});
    }

    async getOrderDetails(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.OrderDetailsWhereUniqueInput;
        where?: Prisma.OrderDetailsWhereInput;
        orderBy?: Prisma.OrderDetailsOrderByWithRelationInput;
    }): Promise<OrderDetails[]> {
        const {skip, take, cursor, where, orderBy} = params;
        return this.prisma.orderDetails.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async updateOrderDetails(params: {
        where: Prisma.OrderDetailsWhereUniqueInput;
        data: Prisma.OrderDetailsUpdateInput;
    }): Promise<OrderDetails> {
        const {where, data} = params;
        return this.prisma.orderDetails.update({
            data,
            where,
        });
    }

    async deleteOrderDetails(params: { where: Prisma.OrderDetailsWhereUniqueInput }): Promise<OrderDetails> {
        const {where} = params;
        return this.prisma.orderDetails.delete({
            where,
        });
    }
}