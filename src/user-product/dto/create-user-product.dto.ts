import {ApiProperty} from "@nestjs/swagger";

export class CreateUserProductDto {
  @ApiProperty()
  userId: number;
  @ApiProperty()
  productId: number;
  @ApiProperty()
  quantity: number;
}