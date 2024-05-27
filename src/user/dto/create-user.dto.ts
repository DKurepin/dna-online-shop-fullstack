import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
  @ApiProperty()
  phoneNumber: string;
  @IsEnum(Role)
  role: Role;
  @ApiProperty()
  username: string;
  @ApiProperty()
  address: string;
}
