import {Injectable} from "@nestjs/common";
import {Prisma, Category} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class CategoryRepository {
    constructor(private prisma: PrismaService) {
    }

    async createCategory(params: { data: Prisma.CategoryCreateInput }): Promise<Category> {
        const {data} = params;
        return this.prisma.category.create({data});
    }

    async getCategories(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.CategoryWhereUniqueInput;
        where?: Prisma.CategoryWhereInput;
        orderBy?: Prisma.CategoryOrderByWithRelationInput;
    }): Promise<Category[]> {
        const {skip, take, cursor, where, orderBy} = params;
        return this.prisma.category.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async updateCategory(params: {
        where: Prisma.CategoryWhereUniqueInput;
        data: Prisma.CategoryUpdateInput;
    }): Promise<Category> {
        const {where, data} = params;
        return this.prisma.category.update({
            data,
            where,
        });
    }

    async deleteCategory(params: { where: Prisma.CategoryWhereUniqueInput }): Promise<Category> {
        const {where} = params;
        return this.prisma.category.delete({
            where,
        });
    }

    async getProductsByCategoryId(id: number) {
        return this.prisma.category.findUnique({
            where: {id},
            include: {products: true}
        });
    }
}