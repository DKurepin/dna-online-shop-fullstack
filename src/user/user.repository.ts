import {Injectable} from "@nestjs/common";
import {Prisma, User} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class UserRepository {
    constructor(private prisma: PrismaService) {}

    async createUser(params : {data: Prisma.UserCreateInput }) : Promise<User> {
        const { data } = params;
        return this.prisma.user.create({ data });
    }

    async getUsers(params : {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }) : Promise<User[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.user.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async updateUser(params : {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
    }) : Promise<User> {
        const { where, data } = params;
        return this.prisma.user.update({
            data,
            where,
        });
    }

    async deleteUser(params : {where: Prisma.UserWhereUniqueInput}) : Promise<User> {
        const { where } = params;
        return this.prisma.user.delete({
            where,
        });
    }

    async findOne(params : {where: Prisma.UserWhereUniqueInput}) : Promise<User | null> {
        const { where } = params;
        return this.prisma.user.findUnique({
            where,
        });
    }
}