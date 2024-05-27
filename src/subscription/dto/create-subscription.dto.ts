import { ApiProperty } from "@nestjs/swagger";

export class CreateSubscriptionDto {
  @ApiProperty()
  email: string;
}
