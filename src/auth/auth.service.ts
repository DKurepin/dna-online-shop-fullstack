import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(private userService: UserService,
                private jwtService: JwtService) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.findOne(email);
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        throw new UnauthorizedException('Invalid credentials');
    }
    async login(user: any) {
        console.log(user)
        const payload = { email: user.email, sub: user.id };
        console.log(payload)
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async getUserFromToken(token: string) {
        const payload = this.jwtService.verify(token);
        return this.userService.findOne(payload.email);
    }
}
