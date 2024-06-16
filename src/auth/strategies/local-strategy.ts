import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UnauthorizedException, Injectable } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(telegramId: string, username: string, password: string) {
        const user = await this.authService.validateUser(+telegramId, username, password);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
