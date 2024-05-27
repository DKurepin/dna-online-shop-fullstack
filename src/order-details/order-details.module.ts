import { Module } from '@nestjs/common';
import {PrismaModule} from "../prisma/prisma.module";
import {OrderDetailsService} from "../order-details/order-details.service";
import {OrderDetailsRepository} from "../order-details/order-details.repository";
import {UserModule} from "../user/user.module";
import {UserProductModule} from "../user-product/user-product.module";
import {ProductModule} from "../product/product.module";

@Module({
    imports: [PrismaModule, UserProductModule, ProductModule],
    providers: [OrderDetailsService, OrderDetailsRepository],
    exports: [OrderDetailsService, OrderDetailsRepository]
})
export class OrderDetailsModule {}
