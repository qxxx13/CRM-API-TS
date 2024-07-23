import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { FilesService } from 'src/files/files.service';

@Module({
    controllers: [UserController],
    providers: [UserService, PrismaService, FilesService],
    exports: [UserService],
})
export class UserModule {}
