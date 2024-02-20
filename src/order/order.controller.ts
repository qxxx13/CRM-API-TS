import { Controller, Get, Post, UsePipes, ValidationPipe, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order, OrderStatus } from '@prisma/client';
import { CloseOrderDataType } from 'src/common/types';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get(':id')
    async getOrderById(@Param('id') id: string) {
        return this.orderService.getById(id);
    }

    @Get('')
    async getOrders(
        @Query('page') page: number = 1,
        @Query('perPage') perPage: number = 10,
        @Query('status') status: OrderStatus | 'all' = 'all',
        @Query('searchValue') searchValue: string = '',
    ) {
        return this.orderService.getAll(page, perPage, status, searchValue);
    }

    @Post('')
    @UsePipes(new ValidationPipe())
    async create(@Body() dto: Order) {
        return this.orderService.create(dto);
    }

    @Patch('status')
    async toggleStatus(@Query('id') id: string, @Query('status') status: OrderStatus) {
        return this.orderService.toggleStatus(id, status);
    }

    @Patch('closeOrder/:id')
    async toggleCloseOrder(@Param('id') id: string, @Body() closeData: CloseOrderDataType) {
        return this.orderService.closeOrder(id, closeData);
    }

    @Get('masterId/:id')
    async getMasterIdByOrderId(@Param('id') id: string) {
        const order = this.orderService.getById(id);
        return (await order).MasterId;
    }

    @Delete(':id')
    async deleteOrder(@Param('id') id: string) {
        return this.orderService.delete(id);
    }

    @Patch('messageId')
    async toggleMessageId(@Query('orderId') orderId: string, @Query('messageId') messageId: string) {
        return this.orderService.toggleMessageId(orderId, messageId);
    }

    @Patch('orderMessage')
    async toggleOrderMessageArr(@Query('orderId') orderId: string, @Query('orderMessage') orderMessage: string) {
        return this.orderService.toggleOrderMessage(orderId, orderMessage);
    }
}
