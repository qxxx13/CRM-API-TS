import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { Order, OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { createPaginator } from 'prisma-pagination';
import { OrderDto } from './order.dto';
import { BotService } from 'src/bot/bot.service';

@Injectable()
export class OrderService {
    constructor(
        @Inject(forwardRef(() => BotService)) private readonly botService: BotService,
        private prisma: PrismaService,
    ) {}

    async getById(id: string) {
        const order = await this.prisma.order.findUnique({ where: { Id: +id } });
        if (!order) {
            throw new NotFoundException('Order not found!');
        } else return order;
    }

    async getAll(page: number, perPage: number, status: OrderStatus | 'all', searchValue: string) {
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

        return await orders;
    }

    async create(dto: Order) {
        const newOrder = await this.prisma.order.create({
            data: dto,
        });
        await this.botService.botMessage(dto.MasterId, newOrder);
        return newOrder;
    }

    async toggleStatus(id: string, status: OrderStatus) {
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

    async togglePrice(id: string, price: string) {
        const order = await this.getById(id);
        return this.prisma.order.update({
            where: {
                Id: order.Id,
            },
            data: {
                Price: price,
            },
        });
    }

    async toggleMasterSalary(id: string, salary: string) {
        const order = await this.getById(id);
        return this.prisma.order.update({
            where: {
                Id: order.Id,
            },
            data: {
                MasterSalary: +salary,
            },
        });
    }

    async delete(id: string) {
        return await this.prisma.order.delete({ where: { Id: +id } });
    }

    async filter(searchValue: string, status: OrderStatus) {
        const orders = await this.prisma.order.findMany({
            where: {
                Status: status,
                Address: searchValue,
            },
        });

        return orders;
    }

    async toggleMessageId(orderId: string, messageId: string) {
        const order = await this.getById(orderId);
        return this.prisma.order.update({
            where: {
                Id: order.Id,
            },
            data: {
                MessageId: messageId,
            },
        });
    }

    /* async getMessageId(orderId: string) {
        const order = await this.getById(orderId);
        return this.prisma.order.
    } */
}
