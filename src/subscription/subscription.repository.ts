import {Injectable} from "@nestjs/common";
import {Prisma, Subscription} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class SubscriptionRepository {
    constructor(private prisma: PrismaService) {
    }

    async createSubscription(params: { data: Prisma.SubscriptionCreateInput }): Promise<Subscription> {
        const {data} = params;
        return this.prisma.subscription.create({data});
    }

    async getSubscriptions(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.SubscriptionWhereUniqueInput;
        where?: Prisma.SubscriptionWhereInput;
        orderBy?: Prisma.SubscriptionOrderByWithRelationInput;
    }): Promise<Subscription[]> {
        const {skip, take, cursor, where, orderBy} = params;
        return this.prisma.subscription.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async deleteSubscription(params: { where: Prisma.SubscriptionWhereUniqueInput }): Promise<Subscription> {
        const {where} = params;
        return this.prisma.subscription.delete({
            where,
        });
    }

    async updateSubscription(params: {
        where: Prisma.SubscriptionWhereUniqueInput;
        data: Prisma.SubscriptionUpdateInput;
}): Promise<Subscription> {
    const {where, data} = params;
    return this.prisma.subscription.update({
        data,
        where,
    });
    }
}