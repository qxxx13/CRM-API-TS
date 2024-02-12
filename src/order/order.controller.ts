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
        this.orderService.toggleStatus(id, 'fulfilled');
        return this.orderService.togglePrice(id, price);
    }

    @Patch('total')
    async toggleTotalPrice(@Query('id') id: string, @Query('totalPrice') totalPrice: string) {
        this.orderService.toggleTotalPrice(id, totalPrice);
    }

    @Patch('expenses')
    async toggleExpenses(@Query('id') id: string, @Query('expenses') expenses: string) {
        this.orderService.toggleExpenses(id, expenses);
    }

    @Patch('masterSalary')
    async toggleMasterSalary(@Query('id') id: string, @Query('price') price: string) {
        return this.orderService.toggleMasterSalary(id, price);
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

    @Patch('closeOrderMessage')
    async closeOrderMessage(@Query('orderId') orderId: string, @Query('masterId') masterId: string) {
        return this.orderService.closeOrderMessage(+orderId, +masterId);
    }
}
