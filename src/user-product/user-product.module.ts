import {forwardRef, Module} from '@nestjs/common';
import { UserProductService } from './user-product.service';
import { UserProductController } from './user-product.controller';
import {PrismaModule} from "../prisma/prisma.module";
import {UserProductRepository} from "./user-product.repository";
import {UserRepository} from "../user/user.repository";
import {ProductRepository} from "../product/product.repository";
import {UserModule} from "../user/user.module";
import {ProductModule} from "../product/product.module";
import {AuthModule} from "../auth/auth.module";

@Module({
  controllers: [UserProductController],
  imports: [PrismaModule, forwardRef(() =>UserModule), forwardRef(() =>ProductModule),
  AuthModule],
  providers: [UserProductService, UserProductRepository],
  exports: [UserProductRepository, UserProductService]
})
export class UserProductModule {}
