import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";

export class UserDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  password: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  role: Role;
  @ApiProperty()
  username: string;
  @ApiProperty()
  address: string;
}
