import {forwardRef, Module} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import {PrismaModule} from "../prisma/prisma.module";
import {OrderRepository} from "./order.repository";
import {OrderDetailsService} from "../order-details/order-details.service";
import {OrderDetailsRepository} from "../order-details/order-details.repository";
import {UserModule} from "../user/user.module";
import {UserProductModule} from "../user-product/user-product.module";
import {OrderDetailsModule} from "../order-details/order-details.module";
import {AuthModule} from "../auth/auth.module";

@Module({
  controllers: [OrderController],
  imports: [PrismaModule, forwardRef(() =>UserModule), forwardRef(() =>UserProductModule), forwardRef(() =>OrderDetailsModule),
    AuthModule],
  providers: [OrderService, OrderRepository],
  exports: [OrderRepository, OrderService]
})
export class OrderModule {}
