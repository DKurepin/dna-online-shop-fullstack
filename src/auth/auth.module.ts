import {forwardRef, Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import {PrismaModule} from "../prisma/prisma.module";
import {UserModule} from "../user/user.module";
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./strategies/local.strategy";
import {AuthController} from "./auth.controller";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtStrategy} from "./strategies/jwt.strategy";

@Module({
  imports: [PrismaModule, forwardRef(() =>UserModule), PassportModule, ConfigModule,
  JwtModule.registerAsync(
    {imports: [ConfigModule],
        useFactory:  (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET'),
            signOptions: {expiresIn: '30d'},
            }),
        inject: [ConfigService],
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule {}
