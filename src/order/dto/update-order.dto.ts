import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus, Prisma } from "@prisma/client";
import {OrderDto} from "./order.dto";

export class UpdateOrderDto {

  @ApiProperty()
  id: number;

  // @ApiProperty({ required: false, nullable: true })
  // totalPrice?: number;

  @ApiProperty({ required: false, nullable: true })
  status?: OrderStatus;

  // @ApiProperty({ required: false, nullable: true })
  // createdAt?: Date;

  // @ApiProperty({ required: false, nullable: true })
  // updatedAt?: Date;

  @ApiProperty({ required: false, nullable: true })
  address?: string;
}
