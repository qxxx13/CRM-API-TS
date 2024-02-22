import { Injectable } from '@nestjs/common';
import { Order, User } from '@prisma/client';
import * as TelegramBot from 'node-telegram-bot-api';
import { newOrderMessage } from './common/OrderMessage';
import { serverInstance, clientInstance } from './common/instances';

@Injectable()
export class BotService {
    constructor() {}

    bot = new TelegramBot(process.env.BOT_API_TOKEN, { polling: true });

    async createOrderBotMessage(order: Order) {
        const master: User = (await serverInstance
            .get(`user/${order.MasterId}`)
            .then((res) => res.data)) as unknown as User;

        const chatId = master.TelegramChatId;
        const messageThreadId = master.MessageThreadId;

        let msgId: number;

        //?Отправка сообщения мастеру
        await this.bot
            .sendMessage(+chatId, 'Новая заявка', { message_thread_id: +messageThreadId })
            .then(async (msg: TelegramBot.Message) => (msgId = msg.message_id))
            .catch((error) => console.log(error));

        const takeOrderOptions = {
            inline_keyboard: [[{ text: 'Прием/отказ', url: `${clientInstance}/take/${chatId}/${msgId}/${order.Id}` }]],
        };

        await this.bot.editMessageText('Новая заявка', {
            chat_id: chatId,
            message_id: msgId,
            reply_markup: takeOrderOptions,
        });

        await serverInstance.patch(`orders/messageId?orderId=${order.Id}&messageId=${msgId}`).then((res) => res.data);

        /* //* Отправка во все заявки
        await this.bot
            .sendMessage('-1002048995957', newOrderMessage(order), { message_thread_id: 4 })
            .then(
                async (msg: TelegramBot.Message) =>
                    await serverInstance.patch(`orders/allOrdersMessageId?orderId=${order.Id}&messageId=${msg}`),
            );
        //*

        //* Отправка в активные
        await this.bot
            .sendMessage(-1002048995957, newOrderMessage(order), { message_thread_id: 958 })
            .then(
                async (msg: TelegramBot.Message) =>
                    await serverInstance.patch(`orders/activeOrdersMessageId?orderId=${order.Id}&messageId=${msg}`),
            );
        //* */
    }

    async takeOrderBotMessage(chatId: string, messageId: string, orderId: string) {
        await serverInstance.patch(`orders/status?id=${orderId}&status=active`);

        const OrderOptions = {
            inline_keyboard: [[{ text: 'В работе', url: `${clientInstance}/work/${chatId}/${messageId}/${orderId}` }]],
        };

        const order: Order = await serverInstance.get(`orders/${orderId}`).then((res) => res.data);

        this.bot.editMessageText(newOrderMessage(order), {
            chat_id: chatId,
            message_id: +messageId,
            reply_markup: OrderOptions,
        });
    }

    async atWorkOrderBotMessage(chatId: string, messageId: string, orderId: string) {
        await serverInstance.patch(`orders/status?id=${orderId}&status=atWork`);

        const OrderOptions = {
            inline_keyboard: [[{ text: 'В работе', url: `${clientInstance}/work/${chatId}/${messageId}/${orderId}` }]],
        };

        const order: Order = await serverInstance.get(`orders/${orderId}`).then((res) => res.data);

        await serverInstance.patch(`user/status?id=${order.MasterId}&status=atWork`);

        this.bot.editMessageText(newOrderMessage(order), {
            chat_id: chatId,
            message_id: +messageId,
            reply_markup: OrderOptions,
        });
    }

    async wentForSpareOrderBotMessage(chatId: string, messageId: string, orderId: string) {
        await serverInstance.patch(`orders/status?id=${orderId}&status=masterWentForSparePart`);

        const OrderOptions = {
            inline_keyboard: [[{ text: 'Вернулся', url: `${clientInstance}/went/${chatId}/${messageId}/${orderId}` }]],
        };

        const order: Order = await serverInstance.get(`orders/${orderId}`).then((res) => res.data);

        this.bot.editMessageText(newOrderMessage(order), {
            chat_id: chatId,
            message_id: +messageId,
            reply_markup: OrderOptions,
        });
    }

    async closeOrderBotMessage(chatId: string, messageId: string, orderId: string) {
        const order: Order = await serverInstance.get(`orders/${orderId}`).then((res) => res.data);
        const newMessage = `#${order.Id}
Закрыта

Номер: ${order.ClientPhoneNumber.replaceAll('-', '')}
Адрес: ${order.Address}
——————
К сдаче: ${order.CompanyShare}

Забрал: ${order.Total}
Расход: ${order.Expenses}
Итог: ${order.Price}`;

        this.bot.editMessageText(newMessage, {
            chat_id: chatId,
            message_id: +messageId,
        });
    }

    async rejectByMasterOrderBotMessage(chatId: string, messageId: string, orderId: string) {
        await serverInstance.patch(`orders/status?id=${orderId}&status=rejectedByMaster`);

        this.bot.editMessageText('Заявка отклонена мастером', {
            chat_id: chatId,
            message_id: +messageId,
        });
    }

    async rejectByClientOrderBotMessage(chatId: string, messageId: string, orderId: string) {
        await serverInstance.patch(`orders/status?id=${orderId}&status=rejectedByClient`);

        this.bot.editMessageText('Заявка отклонена клиентом', {
            chat_id: chatId,
            message_id: +messageId,
        });
    }
}
