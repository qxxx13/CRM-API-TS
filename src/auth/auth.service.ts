import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService,
    ) {}

    async validateUser(telegramId: number, username: string, password: string) {
        console.log(`tg: ${telegramId}`, `user: ${username}`, `pass: ${password}`);
        let user: User;

        if (username !== '') {
            user = await this.userService.findOneWithUserName(username);
        } else {
            user = await this.userService.findOneWithTelegramId(telegramId);
        }

        // TODO: You must to hash password in DB, and use bcrypt.compare(data, hash)
        if (user && password === user.Password) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { Password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: { telegramId: number; username: string; password: string }) {
        /* const payload = {
            telegramId: user.telegramId,
            username: user.username,
        }; */
        console.log(user);

        const userData = await this.validateUser(user.telegramId, user.username, user.password);

        return {
            ...userData,
            /* accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }), */
        };
    }

    /* async loginByTgId(user: { telegramId: string; password: string }) {
        const payload = {
            telegramId: user.telegramId,
        };

        console.log(user);

        const userData = await this.validateUser(user.telegramId, '', user.password);

        return {
            ...userData,
            accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
        };
    } */

    async refreshToken(user: User) {
        const payload = {
            username: user.UserName,
        };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}
