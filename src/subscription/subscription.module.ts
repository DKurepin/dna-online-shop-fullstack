import {forwardRef, Module} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { PrismaService } from '../prisma.service';
import {PrismaModule} from "../prisma/prisma.module";
import {SubscriptionRepository} from "./subscription.repository";
import {UserModule} from "../user/user.module";
import {AuthModule} from "../auth/auth.module";

@Module({
  controllers: [SubscriptionController],
  imports: [ forwardRef(() =>PrismaModule),
    forwardRef(() =>UserModule),
  AuthModule],
  providers: [SubscriptionService, SubscriptionRepository],
})
export class SubscriptionModule {}
