import { Controller, Get, Post, UsePipes, ValidationPipe, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order, OrderStatus } from '@prisma/client';

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

    @Patch('price')
    async togglePrice(@Query('id') id: string, @Query('price') price: string) {
        return this.orderService.togglePrice(id, price);
    }

    @Delete(':id')
    async deleteOrder(@Param('id') id: string) {
        return this.orderService.delete(id);
    }
}
