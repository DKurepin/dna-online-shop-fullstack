import {forwardRef, MiddlewareConsumer, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
// import { ServeStaticModule } from '@nestjs/serve-static';
import { SubscriptionModule } from './subscription/subscription.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { UserProductModule } from './user-product/user-product.module';
import { AuthModule } from './auth/auth.module';
import {AuthMiddleware} from "./auth.middleware";
import { WebsocketModule } from './websocket/websocket.module';
// import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.run/start.run.xml',
    }),
    forwardRef(() =>SubscriptionModule),
    ProductModule,
    CategoryModule,
    forwardRef(() =>OrderModule),
    forwardRef(() =>UserModule),
    UserProductModule,
    AuthModule,
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_INTERCEPTOR',
      useValue: 'TimingInterceptor',
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(AuthMiddleware)
        .forRoutes('/cart', '/order', '/users/page/', '/users/page/edit/');
  }
}
