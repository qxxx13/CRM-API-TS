import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
/* import { LocalAuthGuard } from './guards/local-auth.guard'; */
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService,
    ) {}

    /* @UseGuards(LocalAuthGuard) */
    @Post('login')
    async login(@Body() user: { telegramId: number; username: string; password: string }) {
        return await this.authService.login(user);
    }

    /* @Post('loginByTgId')
    async loginByTgId(@Body() user: { telegramId: string; password: string }) {
        return await this.authService.loginByTgId(user);
    } */

    @Post('register')
    async registerUser(@Body() createUser: User) {
        return await this.userService.create(createUser);
    }

    @UseGuards(RefreshJwtGuard)
    @Post('refresh')
    async refreshToken(@Body() body) {
        return this.authService.refreshToken(body);
    }
}
