import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: Function) {
        const token = req.cookies.jwt; // Проверяем наличие токена в куках
        if (!token) {
            return res.redirect('/account'); // Предполагается, что у вас есть маршрут для страницы входа
        }
        next();
    }
}
