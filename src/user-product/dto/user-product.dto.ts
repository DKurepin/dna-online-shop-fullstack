import {ApiProperty} from "@nestjs/swagger";

export class UserProductDto {
  @ApiProperty()
    id: number;
  @ApiProperty()
  userId: number;
  @ApiProperty()
  productId: number;
  @ApiProperty()
  quantity: number;
}