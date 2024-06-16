import { Injectable, NotFoundException } from '@nestjs/common';
import { Role, User, UserStatus } from '@prisma/client';
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

    async findOneWithTelegramId(telegramId: number) {
        return await this.prisma.user.findFirst({ where: { TelegramId: String(telegramId) } });
    }

    async getInterestRateById(id: string) {
        const user = this.prisma.user.findFirst({ where: { Id: +id } });
        return (await user).InterestRate;
    }

    async getAll(role: Role) {
        return await this.prisma.user.findMany({ where: { Role: role } });
    }

    async create(dto: User) {
        return await this.prisma.user.create({
            data: dto,
        });
    }

    async toggleStatus(id: string, status: UserStatus) {
        const user = await this.getById(+id);
        return this.prisma.user.update({
            where: {
                Id: user.Id,
            },
            data: {
                Status: status,
            },
        });
    }

    async delete(id: string) {
        return await this.prisma.user.delete({ where: { Id: +id } });
    }
}
