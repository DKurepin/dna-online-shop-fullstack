import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Category } from "@prisma/client";

export class UpdateProductDto extends PartialType(CreateProductDto) {

  @ApiProperty()
  id: number;

  @ApiProperty({ required: false, nullable: true })
  name?: string;

  @ApiProperty({ required: false, nullable: true })
  description?: string;

  @ApiProperty({ required: false, nullable: true })
  price?: number;

  @ApiProperty({ required: false, nullable: true })
  stock?: number;

  @ApiProperty({ required: false, nullable: true })
  categoryId?: number;

  @ApiProperty({ required: false, nullable: true })
  photo?: string;
}
