import { Injectable } from '@nestjs/common';
import { Order, User } from '@prisma/client';
import * as TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import { newOrderMessage } from './common/OrderMessage';

@Injectable()
export class BotService {
    constructor() {}

    bot = new TelegramBot(process.env.BOT_API_TOKEN, { polling: true });

    async createOrderBotMessage(order: Order) {
        const master: User = await axios
            .get(`http://77.91.84.85:5555/api/user/${order.MasterId}`)
            .then((res) => res.data);

        const chatId = master.TelegramChatId;
        const messageThreadId = master.MessageThreadId;

        let msgId: number;

        await this.bot
            .sendMessage(+chatId, 'Новая заявка', { message_thread_id: +messageThreadId })
            .then(
                async (msg: TelegramBot.Message) => (msgId = msg.message_id),
                await axios
                    .patch(`http://77.91.84.85:5555/api/orders/messageId?orderId=${order.Id}&messageId=${msgId}`)
                    .then((res) => res.data),
            )
            .catch((error) => console.log(error));

        const takeOrderOptions = {
            inline_keyboard: [[{ text: 'Прием/отказ', url: `http://77.91.84.85/take/${chatId}/${msgId}/${order.Id}` }]],
        };

        await this.bot.editMessageText('Новая заявка', {
            chat_id: chatId,
            message_id: msgId,
            reply_markup: takeOrderOptions,
        });
    }

    async takeOrderBotMessage(chatId: string, messageId: string, orderId: string) {
        await axios.patch(`http://77.91.84.85:5555/api/orders/status?id=${orderId}&status=active`);

        const OrderOptions = {
            inline_keyboard: [[{ text: 'В работе', url: `http://77.91.84.85/work/${chatId}/${messageId}/${orderId}` }]],
        };

        const order: Order = await axios.get(`http://77.91.84.85:5555/api/orders/${orderId}`).then((res) => res.data);

        this.bot.editMessageText(newOrderMessage(order), {
            chat_id: chatId,
            message_id: +messageId,
            reply_markup: OrderOptions,
        });
    }

    async atWorkOrderBotMessage(chatId: string, messageId: string, orderId: string) {
        await axios.patch(`http://77.91.84.85:5555/api/orders/status?id=${orderId}&status=atWork`);

        const OrderOptions = {
            inline_keyboard: [[{ text: 'В работе', url: `http://77.91.84.85/work/${chatId}/${messageId}/${orderId}` }]],
        };

        const order: Order = await axios.get(`http://77.91.84.85:5555/api/orders/${orderId}`).then((res) => res.data);

        await axios.patch(`http://77.91.84.85:5555/api/user/status?id=${order.MasterId}&status=atWork`);

        this.bot.editMessageText(newOrderMessage(order), {
            chat_id: chatId,
            message_id: +messageId,
            reply_markup: OrderOptions,
        });
    }

    async wentForSpareOrderBotMessage(chatId: string, messageId: string, orderId: string) {
        await axios.patch(`http://77.91.84.85:5555/api/orders/status?id=${orderId}&status=masterWentForSparePart`);

        const OrderOptions = {
            inline_keyboard: [[{ text: 'Вернулся', url: `http://77.91.84.85/went/${chatId}/${messageId}/${orderId}` }]],
        };

        const order: Order = await axios.get(`http://77.91.84.85:5555/api/orders/${orderId}`).then((res) => res.data);

        this.bot.editMessageText(newOrderMessage(order), {
            chat_id: chatId,
            message_id: +messageId,
            reply_markup: OrderOptions,
        });
    }

    async closeOrderBotMessage(chatId: string, messageId: string, orderId: string) {
        const order: Order = await axios.get(`http://77.91.84.85:5555/api/orders/${orderId}`).then((res) => res.data);
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
        await axios.patch(`http://77.91.84.85:5555/api/orders/status?id=${orderId}&status=rejectedByMaster`);

        this.bot.editMessageText('Заявка отклонена мастером', {
            chat_id: chatId,
            message_id: +messageId,
        });
    }

    async rejectByClientOrderBotMessage(chatId: string, messageId: string, orderId: string) {
        await axios.patch(`http://77.91.84.85:5555/api/orders/status?id=${orderId}&status=rejectedByClient`);

        this.bot.editMessageText('Заявка отклонена клиентом', {
            chat_id: chatId,
            message_id: +messageId,
        });
    }
}
