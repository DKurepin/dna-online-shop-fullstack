import {ApiProperty} from "@nestjs/swagger";

export class UpdateUserProductDto {
  @ApiProperty()
  userId: number;
  @ApiProperty()
  productId: number;
  @ApiProperty({ required: false, nullable: true })
  quantity?: number;
}