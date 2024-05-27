import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import {PrismaModule} from "../prisma/prisma.module";
import {ProductRepository} from "./product.repository";
import {CategoryRepository} from "../category/category.repository";
import {AuthModule} from "../auth/auth.module";
import {WebsocketModule} from "../websocket/websocket.module";

@Module({
  controllers: [ProductController],
  imports: [PrismaModule, AuthModule, WebsocketModule],
  providers: [ProductService, ProductRepository, CategoryRepository],
  exports: [ProductRepository, ProductService]
})
export class ProductModule {}
