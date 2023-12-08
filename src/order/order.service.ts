import { Injectable, NotFoundException } from '@nestjs/common';
import { Status, Order, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { createPaginator } from 'prisma-pagination';
import { OrderDto } from './order.dto';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) {}

    async getById(id: string) {
        const order = await this.prisma.order.findUnique({ where: { Id: +id } });
        if (!order) {
            throw new NotFoundException('Order not found!');
        } else return order;
    }

    getAll(page: number, perPage: number, status: Status | 'all', searchValue: string) {
        const paginate = createPaginator({ perPage });

        const searchByStatus = status !== 'all' ? status : {};
        const search = searchValue !== '' ? searchValue : {};

        const orders = paginate<OrderDto, Prisma.OrderFindManyArgs>(
            this.prisma.order,
            {
                where: {
                    Status: searchByStatus,
                    ClientPhoneNumber: search,
                },
                orderBy: { Id: 'desc' },
            },
            { page: page },
        );

        return orders;
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

    async delete(id: string) {
        return await this.prisma.order.delete({ where: { Id: +id } });
    }

    async filter(searchValue: string, status: Status) {
        const orders = await this.prisma.order.findMany({
            where: {
                Status: status,
                Address: searchValue,
            },
        });

        return orders;
    }
}
