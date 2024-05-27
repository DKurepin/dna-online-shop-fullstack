import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  id: number;
  // @ApiProperty({required: false, nullable: true, enum: TaskStatus})
  // status?: TaskStatus;

  @ApiProperty({ required: false, nullable: true })
  username?: string;

  @ApiProperty({ required: false, nullable: true })
  address?: string;

  @ApiProperty({ required: false, nullable: true })
  phoneNumber?: string;

  @ApiProperty({ required: false, nullable: true })
  password?: string;
}
