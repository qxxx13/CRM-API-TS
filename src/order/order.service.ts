import { Injectable, NotFoundException } from '@nestjs/common';
import { IsWorkingOrder, Order, OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { createPaginator } from 'prisma-pagination';
import { OrderDto } from './order.dto';
import { CloseOrderDataType } from 'src/common/types';
import { serverInstance } from 'src/bot/common/instances';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class OrderService {
    constructor(
        private prisma: PrismaService,
        private readonly fileService: FilesService,
    ) {}

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
        startDate: Date | 'all',
        endDate: Date | 'all',
    ) {
        const paginate = createPaginator({ perPage });

        const searchByStatus = status !== 'all' ? status : {};
        const search = searchValue !== '' ? searchValue : {};
        const searchByMasterId = masterId !== 'all' ? +masterId : {};
        const searchByIsWorking = isWorking !== 'all' ? isWorking : {};
        const searchByStartDate = startDate !== 'all' ? new Date(startDate) : new Date('2020-01-01');
        const searchByEndDate = endDate !== 'all' ? new Date(endDate) : new Date('2100-01-01');

        const orders = paginate<OrderDto, Prisma.OrderFindManyArgs>(
            this.prisma.order,
            {
                where: {
                    MasterId: searchByMasterId,
                    Status: searchByStatus,
                    ClientPhoneNumber: search,
                    IsWorking: searchByIsWorking,
                    Date: {
                        lte: searchByEndDate,
                        gte: searchByStartDate,
                    },
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

    async patchCloserId(orderId: string, closerId: string) {
        const order = await this.getById(orderId);
        return this.prisma.order.update({
            where: {
                Id: order.Id,
            },
            data: {
                OrderCloserId: +closerId,
            },
        });
    }

    async closeOrder(id: string, closeData: CloseOrderDataType, chatId: string, messageId: string, closerId: string) {
        const order = await this.getById(id);

        await this.patchCloserId(String(order.Id), closerId);

        if (+closeData.Debt !== 0) {
            await this.toggleStatus(String(order.Id), OrderStatus.debt).catch((e) => console.log(e));
        } else {
            await this.toggleStatus(String(order.Id), OrderStatus.awaitingPayment).catch((e) => console.log(e));
        }
        this.toggleIsWorking(String(order.Id), IsWorkingOrder.close);
        await serverInstance
            .patch(`/bot/close?chatId=${chatId}&messageId=${messageId}&orderId=${order.Id}`)
            .catch((e) => console.log(e));

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
        await serverInstance.patch(`/bot/delete?orderId=${id}&chatId=${chatId}&messageId=${messageId}`).catch((e) => e);

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

    async patchReasonImage(orderId: string, imageBuffer: Buffer, fileName: string) {
        const image = await this.fileService.uploadFile(imageBuffer, fileName);
        const order = await this.getById(orderId);

        await this.prisma.order.update({
            where: { Id: order.Id },
            data: {
                ReasonImageId: image.Id,
            },
        });
    }
}
