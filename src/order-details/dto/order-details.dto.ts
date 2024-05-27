import { ApiProperty } from "@nestjs/swagger";
export class OrderDetailsDto {

    @ApiProperty()
    id: number;

    @ApiProperty()
    orderId: number;

    @ApiProperty()
    productId: number;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    unitPrice: number;

    @ApiProperty()
    totalPrice: number;
}
