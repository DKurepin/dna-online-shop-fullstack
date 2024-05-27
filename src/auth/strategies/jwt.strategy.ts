import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {UserService} from "../../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService,
                private userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => {
                    return req.cookies?.jwt;
                },
            ]) || ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        const user = await this.userService.findOne(payload.email);
        if (!user) {
            throw new UnauthorizedException('Unauthorized');
        }
        console.log('user role', user.role);
        return { userId: payload.sub, email: payload.email, role: user.role };
    }
}