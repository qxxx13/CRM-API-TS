import { Controller, Get, Post, UsePipes, ValidationPipe, Body, Patch, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order, Status } from '@prisma/client';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get(':id')
    async getOrderById(@Param('id') id: string) {
        return this.orderService.getById(id);
    }

    @Get('')
    async getOrders() {
        return this.orderService.getAll();
    }

    @Post('')
    @UsePipes(new ValidationPipe())
    async create(@Body() dto: Order) {
        return this.orderService.create(dto);
    }

    @Patch(':id')
    async toggleStatus(@Param('id') @Body() id: string, status: Status) {
        return this.orderService.toggleStatus(id, status);
    }
}
