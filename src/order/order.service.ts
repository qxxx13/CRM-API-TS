import { Injectable, NotFoundException } from '@nestjs/common';
import { Status, Order } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) {}

    async getById(id: string) {
        const order = await this.prisma.order.findUnique({ where: { Id: +id } });
        if (!order) {
            throw new NotFoundException('Order not found!');
        } else return order;
    }

    getAll() {
        return this.prisma.order.findMany();
    }

    create(dto: Order) {
        return this.prisma.order.create({
            data: dto,
        });
    }

    async toggleStatus(id: string, status: Status) {
        const order = await this.getById(id);
        return this.prisma.order.update({
            where: {
                Id: order.Id,
            },
            data: {
                Status: status,
            },
        });
    }
}
