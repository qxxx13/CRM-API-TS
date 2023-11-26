import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async getById(id: string) {
        const user = await this.prisma.user.findUnique({ where: { Id: +id } });
        if (!user) {
            throw new NotFoundException('User not found!');
        } else return user;
    }

    getAll() {
        return this.prisma.user.findMany();
    }

    create(dto: User) {
        return this.prisma.user.create({
            data: dto,
        });
    }
}
