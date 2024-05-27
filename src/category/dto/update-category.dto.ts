import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
