import { Injectable, NotFoundException } from '@nestjs/common';
import { IsWorkingOrder, Order, OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { createPaginator } from 'prisma-pagination';
import { OrderDto } from './order.dto';
import { CloseOrderDataType } from 'src/common/types';
import { serverInstance } from 'src/bot/common/instances';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) {}

    async getById(id: string) {
        const order = await this.prisma.order.findUnique({ where: { Id: +id } });
        if (!order) {
            throw new NotFoundException('Order not found!');
        } else return order;
    }

    async getAll(
        page: number,
        perPage: number,
        status: OrderStatus | 'all',
        searchValue: string,
        masterId: string | 'all',
        isWorking: IsWorkingOrder | 'all',
    ) {
        const paginate = createPaginator({ perPage });

        const searchByStatus = status !== 'all' ? status : {};
        const search = searchValue !== '' ? searchValue : {};
        const searchByMasterId = masterId !== 'all' ? +masterId : {};
        const searchByIsWorking = isWorking !== 'all' ? isWorking : {};

        const orders = paginate<OrderDto, Prisma.OrderFindManyArgs>(
            this.prisma.order,
            {
                where: {
                    MasterId: searchByMasterId,
                    Status: searchByStatus,
                    ClientPhoneNumber: search,
                    IsWorking: searchByIsWorking,
                },
                orderBy: { Id: 'desc' },
            },
            { page: page },
        );

        return await orders;
    }

    async getAllByUserId(page: number, perPage: number, status: OrderStatus | 'all', userId: string) {
        const paginate = createPaginator({ perPage });

        const searchByStatus = status !== 'all' ? status : {};
        const searchByMasterId = userId !== 'all' ? +userId : {};

        const orders = paginate<OrderDto, Prisma.OrderFindManyArgs>(
            this.prisma.order,
            {
                where: {
                    MasterId: searchByMasterId,
                    Status: searchByStatus,
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
        if (newOrder.Status === 'distribution') {
            await serverInstance.post('bot/distribution', newOrder);
        } else await serverInstance.post('bot/create', newOrder);

        return newOrder;
    }

    async edit(dto: Order) {
        const editOrder = await this.prisma.order.update({
            where: { Id: dto.Id },
            data: dto,
        });
        if (editOrder.Status !== 'distribution' && editOrder.Status !== 'transfer') {
            await serverInstance.post('bot/edit', editOrder);
        }

        return editOrder;
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

    async closeOrder(id: string, closeData: CloseOrderDataType, chatId: string, messageId: string) {
        const order = await this.getById(id);

        try {
            if (+closeData.Debt !== 0) {
                await serverInstance.patch(`/orders/status?id=${order.Id}&status=debt`);
            } else {
                await serverInstance.patch(`/orders/status?id=${order.Id}&status=awaitingPayment`);
            }

            await serverInstance.patch(`/orders/isWorking?id=${order.Id}&isWorking=close`);
            await serverInstance.patch(`/bot/close?chatId=${chatId}&messageId=${messageId}&orderId=${order.Id}`);
        } catch (error) {
            console.log(error);
        }

        return this.prisma.order.update({
            where: {
                Id: order.Id,
            },
            data: {
                Total: +closeData.TotalPrice,
                Price: closeData.Price,
                MasterSalary: +closeData.MasterSalary,
                Expenses: +closeData.Expenses,
                CompanyShare: +closeData.CompanyShare,
                Comments: closeData.Comments,
                Debt: +closeData.Debt,
            },
        });
    }

    async delete(id: string, chatId: string, messageId: string) {
        try {
            await serverInstance.patch(`/bot/delete?orderId=${id}&chatId=${chatId}&messageId=${messageId}`);
        } catch (error) {
            console.log(error);
        }

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

    async toggleDistributionOrdersMessageId(orderId, messageId: string) {
        const order = await this.getById(orderId);
        return this.prisma.order.update({
            where: {
                Id: order.Id,
            },
            data: {
                DistributionOrderMessageId: messageId,
            },
        });
    }

    async toggleAllOrdersMessageId(orderId: string, messageId: string) {
        const order = await this.getById(orderId);
        return this.prisma.order.update({
            where: {
                Id: order.Id,
            },
            data: {
                AllOrdersMessageId: messageId,
            },
        });
    }

    async toggleActiveOrdersMessageId(orderId: string, messageId: string) {
        const order = await this.getById(orderId);
        return this.prisma.order.update({
            where: {
                Id: order.Id,
            },
            data: {
                ActiveOrderMessageId: messageId,
            },
        });
    }

    async toggleIsWorking(orderId: string, isWorking: IsWorkingOrder) {
        const order = await this.getById(orderId);
        return this.prisma.order.update({
            where: {
                Id: order.Id,
            },
            data: {
                IsWorking: isWorking,
            },
        });
    }

    async toggleOrderMessage(orderId: string, botMessage: string) {
        const order = await this.getById(orderId);
        return this.prisma.order.update({
            where: {
                Id: order.Id,
            },
            data: {
                BotMessage: botMessage,
            },
        });
    }

    async getMessageId(orderId: string) {
        const order = await this.getById(orderId);
        return order.MessageId;
    }
}
