import {ApiProperty} from "@nestjs/swagger";

export class SubscriptionDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    email: string;
}