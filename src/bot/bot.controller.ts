import { Body, Controller, Patch, Post, Query } from '@nestjs/common';
import { BotService } from './bot.service';
import { Order } from '@prisma/client';

@Controller('bot')
export class BotController {
    constructor(private readonly botService: BotService) {}

    @Post('/create')
    async createOrderMessage(@Body() order: Order) {
        this.botService.createOrderBotMessage(order);
    }

    @Post('/edit')
    async editOrderMessage(@Body() order: Order) {
        this.botService.editOrderBotMessage(order);
    }

    @Patch('/take')
    async toggleOrderMessage(
        @Query('chatId') chatId: string,
        @Query('messageId') messageId: string,
        @Query('orderId') orderId: string,
    ) {
        this.botService.takeOrderBotMessage(chatId, messageId, orderId);
    }

    @Patch('/atWork')
    async toggleOrderMessageAtWork(
        @Query('chatId') chatId: string,
        @Query('messageId') messageId: string,
        @Query('orderId') orderId: string,
    ) {
        this.botService.atWorkOrderBotMessage(chatId, messageId, orderId);
    }

    @Patch('/close')
    async toggleCloseOrderMessage(
        @Query('chatId') chatId: string,
        @Query('messageId') messageId: string,
        @Query('orderId') orderId: string,
    ) {
        this.botService.closeOrderBotMessage(chatId, messageId, orderId);
    }

    @Patch('/went')
    async toggleOrderMessageWent(
        @Query('chatId') chatId: string,
        @Query('messageId') messageId: string,
        @Query('orderId') orderId: string,
    ) {
        this.botService.wentForSpareOrderBotMessage(chatId, messageId, orderId);
    }

    @Patch('/sd')
    async toggleOrderMessageSD(
        @Query('chatId') chatId: string,
        @Query('messageId') messageId: string,
        @Query('orderId') orderId: string,
    ) {
        this.botService.sdOrderBotMessage(chatId, messageId, orderId);
    }

    @Patch('/rejectMaster')
    async toggleOrderMessageRejectByMaster(
        @Query('chatId') chatId: string,
        @Query('messageId') messageId: string,
        @Query('orderId') orderId: string,
    ) {
        this.botService.rejectByMasterOrderBotMessage(chatId, messageId, orderId);
    }
}
