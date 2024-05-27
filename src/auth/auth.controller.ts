import {ApiCookieAuth, ApiTags} from "@nestjs/swagger";
import {Controller, Post, UseGuards, UseInterceptors, Request, Get} from "@nestjs/common";
import {TimingInterceptor} from "../interceptor";
import {AuthService} from "./auth.service";
import {AuthGuard} from "@nestjs/passport";
import {LocalAuthGuard} from "./guards/local-auth.guard";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {Roles} from "./roles.decorator";
import {RolesGuard} from "./guards/roles.guard";
import {Role} from "@prisma/client";

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(TimingInterceptor)
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        console.log('req.user', req.user)
        return this.authService.login(req.user);
    }

    @ApiCookieAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

}