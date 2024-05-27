import {Injectable} from "@nestjs/common";
import {Prisma, Product} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class ProductRepository {
    constructor(private prisma: PrismaService) {
    }

    async createProduct(params: { data: Prisma.ProductCreateInput }): Promise<Product> {
        const {data} = params;
        return this.prisma.product.create({data});
    }

    async getProducts(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.ProductWhereUniqueInput;
        where?: Prisma.ProductWhereInput;
        orderBy?: Prisma.ProductOrderByWithRelationInput;
    }): Promise<Product[]> {
        const {skip, take, cursor, where, orderBy} = params;
        return this.prisma.product.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async updateProduct(params: {
        where: Prisma.ProductWhereUniqueInput;
        data: Prisma.ProductUpdateInput;
    }): Promise<Product> {
        const {where, data} = params;
        return this.prisma.product.update({
            data,
            where,
        });
    }

    async deleteProduct(params: { where: Prisma.ProductWhereUniqueInput }): Promise<Product> {
        const {where} = params;
        return this.prisma.product.delete({
            where,
        });
    }

    async getProductById(id: number): Promise<Product> {
        return this.prisma.product.findUnique({
            where: {
                id: id
            }
        })
    }
}