import {Injectable} from "@nestjs/common";
import {Prisma, UserProduct} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class UserProductRepository {
    constructor(private prisma: PrismaService) {
    }

    async createUserProduct(params: { data: Prisma.UserProductCreateInput }): Promise<UserProduct> {
        const {data} = params;
        return this.prisma.userProduct.create({data});
    }

    async getUserProducts(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserProductWhereUniqueInput;
        where?: Prisma.UserProductWhereInput;
        orderBy?: Prisma.UserProductOrderByWithRelationInput;
    }): Promise<UserProduct[]> {
        const {skip, take, cursor, where, orderBy} = params;
        return this.prisma.userProduct.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async updateUserProduct(params: {
        where: Prisma.UserProductWhereUniqueInput;
        data: Prisma.UserProductUpdateInput;
    }): Promise<UserProduct> {
        const {where, data} = params;
        return this.prisma.userProduct.update({
            data,
            where,
        });
    }

    async deleteUserProduct(params: { where: Prisma.UserProductWhereUniqueInput }): Promise<UserProduct> {
        const {where} = params;
        return this.prisma.userProduct.delete({
            where,
        });
    }

}