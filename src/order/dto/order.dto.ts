import {ApiProperty} from "@nestjs/swagger";
import {OrderStatus} from "@prisma/client";


export class OrderDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    totalPrice: number;

    @ApiProperty()
    status: OrderStatus;

    @ApiProperty()
    userId: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    address: string;
}