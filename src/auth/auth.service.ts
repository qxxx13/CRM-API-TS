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

    async validateUser(username: string, password: string) {
        const user = await this.userService.findOneWithUserName(username);

        // TODO: You must to hash password in DB, and use bcrypt.compare(data, hash)
        if (user && password === user.Password) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { Password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: User) {
        const payload = {
            username: user.UserName,
        };
        return {
            ...user,
            accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
        };
    }

    async refreshToken(user: User) {
        const payload = {
            username: user.UserName,
        };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}
