import {ApiProperty} from "@nestjs/swagger";
import {OrderStatus} from "@prisma/client";

export class CreateOrderDto {

    @ApiProperty()
    userId: number;

    @ApiProperty()
    address: string;
}