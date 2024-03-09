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

    @Post('/distribution')
    async distributionOrderMessage(@Body() order: Order) {
        this.botService.distributionOrderBotMessage(order);
    }

    @Patch('/deleteDistribution')
    async deleteDistributionMessage(@Query('messageId') messageId: string) {
        this.botService.deleteDistributionMessage(messageId);
    }

    @Patch('/transfer')
    async transferOrderMessage(@Query('orderId') orderId: string) {
        this.botService.transferOrder(orderId);
    }

    @Post('/edit')
    async editOrderMessage(@Body() order: Order) {
        this.botService.editOrderBotMessage(order);
    }

    @Patch('/delete')
    async deleteOrderMessage(
        @Query('chatId') chatId: string,
        @Query('messageId') messageId: string,
        @Query('orderId') orderId: string,
    ) {
        this.botService.deleteOrderBotMessage(chatId, messageId, orderId);
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

    @Patch('/rejectClient')
    async toggleOrderMessageRejectByClient(
        @Query('chatId') chatId: string,
        @Query('messageId') messageId: string,
        @Query('orderId') orderId: string,
    ) {
        this.botService.rejectByClientOrderBotMessage(chatId, messageId, orderId);
    }
}
