import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async getById(id: number) {
        const user = await this.prisma.user.findUnique({ where: { Id: id } });
        if (!user) {
            throw new NotFoundException('User not found!');
        } else return user;
    }

    async findOneWithUserName(userName: string) {
        return await this.prisma.user.findFirst({ where: { UserName: userName } });
    }

    async getAll() {
        return await this.prisma.user.findMany();
    }

    async create(dto: User) {
        return await this.prisma.user.create({
            data: dto,
        });
    }
}
