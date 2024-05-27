import {forwardRef, Module} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import {PrismaModule} from "../prisma/prisma.module";
import {UserRepository} from "./user.repository";
import {OrderModule} from "../order/order.module";
import {AuthModule} from "../auth/auth.module";
import {WebsocketModule} from "../websocket/websocket.module";

@Module({
  controllers: [UserController],
  imports: [PrismaModule, forwardRef(() =>OrderModule), forwardRef(() =>AuthModule),
  WebsocketModule],
  providers: [UserService, UserRepository, UserController],
  exports: [UserRepository, UserService, UserController]
})
export class UserModule {}
