import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local-strategy';
import { PrismaService } from 'src/prisma.service';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RefreshJwtStrategy } from './strategies/refreshToken-strategy';
import { FilesService } from 'src/files/files.service';
@Module({
    providers: [AuthService, UserService, LocalStrategy, JwtStrategy, PrismaService, RefreshJwtStrategy, FilesService],
    controllers: [AuthController],
    imports: [
        JwtModule.register({
            secret: `${process.env.jwt_secret}`,
            signOptions: { expiresIn: '3600s' },
        }),
    ],
})
export class AuthModule {}
