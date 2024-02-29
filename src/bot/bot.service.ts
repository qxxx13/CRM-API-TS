import { Injectable } from '@nestjs/common';
import { Order, User } from '@prisma/client';
import * as TelegramBot from 'node-telegram-bot-api';
import { closeOrderAllMessage, closeOrderMessage, newOrderMessage } from './common/OrderMessage';
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
            inline_keyboard: [
                [{ text: 'Открыть заявку', url: `${clientInstance}/work/${chatId}/${msgId}/${order.Id}` }],
            ],
        };

        await this.bot.editMessageText('Новая заявка', {
            chat_id: chatId,
            message_id: msgId,
            reply_markup: takeOrderOptions,
        });

        await serverInstance.patch(`orders/messageId?orderId=${order.Id}&messageId=${msgId}`).then((res) => res.data);

        //* Отправка во все заявки
        await this.bot
            .sendMessage(-1002048995957, newOrderMessage(order), { message_thread_id: 4 })
            .then(
                async (msg: TelegramBot.Message) =>
                    await serverInstance.patch(
                        `orders/allOrdersMessageId?orderId=${order.Id}&messageId=${msg.message_id}`,
                    ),
            );
        //*

        //* Отправка в активные
        await this.bot
            .sendMessage(-1002048995957, newOrderMessage(order), { message_thread_id: 958 })
            .then(
                async (msg: TelegramBot.Message) =>
                    await serverInstance.patch(
                        `orders/activeOrdersMessageId?orderId=${order.Id}&messageId=${msg.message_id}`,
                    ),
            );
        //*
    }

    async editOrderBotMessage(order: Order) {
        const master: User = (await serverInstance
            .get(`user/${order.MasterId}`)
            .then((res) => res.data)) as unknown as User;

        const chatId = master.TelegramChatId;

        const OrderOptions = {
            inline_keyboard: [
                [{ text: 'Открыть заявку', url: `${clientInstance}/work/${chatId}/${order.MessageId}/${order.Id}` }],
            ],
        };

        //?Изменение сообщения у мастера
        await this.bot.editMessageText(newOrderMessage(order), { chat_id: chatId, message_id: +order.MessageId });

        //* Изменение во всех заявках
        await this.bot.editMessageText(newOrderMessage(order), {
            chat_id: -1002048995957,
            message_id: +order.AllOrdersMessageId,
            reply_markup: OrderOptions,
        });

        //*

        //* Изменение в активных
        await this.bot.editMessageText(newOrderMessage(order), {
            chat_id: -1002048995957,
            message_id: +order.ActiveOrderMessageId,
        });

        //*
    }

    async takeOrderBotMessage(chatId: string, messageId: string, orderId: string) {
        await serverInstance.patch(`orders/status?id=${orderId}&status=active`);

        const OrderOptions = {
            inline_keyboard: [
                [{ text: 'Открыть заявку', url: `${clientInstance}/work/${chatId}/${messageId}/${orderId}` }],
            ],
        };

        const order: Order = await serverInstance.get(`orders/${orderId}`).then((res) => res.data);

        try {
            await this.bot.editMessageText(newOrderMessage(order), {
                chat_id: chatId,
                message_id: +messageId,
                reply_markup: OrderOptions,
            });

            //* Редактирование в общей группе
            await this.bot.editMessageText(newOrderMessage(order), {
                chat_id: -1002048995957,
                message_id: +order.AllOrdersMessageId,
            });

            await this.bot.editMessageText(newOrderMessage(order), {
                chat_id: -1002048995957,
                message_id: +order.ActiveOrderMessageId,
            });
            //*
        } catch (error) {
            console.log(error);
        }
    }

    async atWorkOrderBotMessage(chatId: string, messageId: string, orderId: string) {
        await serverInstance.patch(`orders/status?id=${orderId}&status=atWork`);

        const OrderOptions = {
            inline_keyboard: [
                [{ text: 'Открыть заявку', url: `${clientInstance}/work/${chatId}/${messageId}/${orderId}` }],
            ],
        };

        const order: Order = await serverInstance.get(`orders/${orderId}`).then((res) => res.data);

        await serverInstance.patch(`user/status?id=${order.MasterId}&status=atWork`);

        try {
            await this.bot.editMessageText(newOrderMessage(order), {
                chat_id: chatId,
                message_id: +messageId,
                reply_markup: OrderOptions,
            });

            //* Редактирование в общей группе
            await this.bot.editMessageText(newOrderMessage(order), {
                chat_id: -1002048995957,
                message_id: +order.AllOrdersMessageId,
            });

            await this.bot.editMessageText(newOrderMessage(order), {
                chat_id: -1002048995957,
                message_id: +order.ActiveOrderMessageId,
            });
            //*
        } catch (error) {
            console.log(error);
        }
    }

    async sdOrderBotMessage(chatId: string, messageId: string, orderId: string) {
        await serverInstance.patch(`orders/status?id=${orderId}&status=takeToSD`);

        const OrderOptions = {
            inline_keyboard: [
                [{ text: 'Открыть заявку', url: `${clientInstance}/work/${chatId}/${messageId}/${orderId}` }],
            ],
        };

        const order: Order = await serverInstance.get(`orders/${orderId}`).then((res) => res.data);

        try {
            await this.bot.editMessageText(newOrderMessage(order), {
                chat_id: chatId,
                message_id: +messageId,
                reply_markup: OrderOptions,
            });

            //* Редактирование в общей группе
            await this.bot.editMessageText(newOrderMessage(order), {
                chat_id: -1002048995957,
                message_id: +order.AllOrdersMessageId,
            });

            await this.bot.editMessageText(newOrderMessage(order), {
                chat_id: -1002048995957,
                message_id: +order.ActiveOrderMessageId,
            });
            //*
        } catch (error) {
            console.log(error);
        }
    }

    async wentForSpareOrderBotMessage(chatId: string, messageId: string, orderId: string) {
        await serverInstance.patch(`orders/status?id=${orderId}&status=masterWentForSparePart`);

        const OrderOptions = {
            inline_keyboard: [
                [{ text: 'Открыть заявку', url: `${clientInstance}/work/${chatId}/${messageId}/${orderId}` }],
            ],
        };

        const order: Order = await serverInstance.get(`orders/${orderId}`).then((res) => res.data);

        try {
            await this.bot.editMessageText(newOrderMessage(order), {
                chat_id: chatId,
                message_id: +messageId,
                reply_markup: OrderOptions,
            });

            //* Редактирование в общей группе
            await this.bot.editMessageText(newOrderMessage(order), {
                chat_id: -1002048995957,
                message_id: +order.AllOrdersMessageId,
            });

            await this.bot.editMessageText(newOrderMessage(order), {
                chat_id: -1002048995957,
                message_id: +order.ActiveOrderMessageId,
            });
            //*
        } catch (error) {
            console.log(error);
        }
    }

    async closeOrderBotMessage(chatId: string, messageId: string, orderId: string) {
        const order: Order = await serverInstance.get(`orders/${orderId}`).then((res) => res.data);

        const newMessage = closeOrderMessage(order);

        try {
            await this.bot.editMessageText(newMessage, {
                chat_id: chatId,
                message_id: +messageId,
            });

            //* Редактирование в общей группе
            await this.bot.editMessageText(closeOrderAllMessage(order), {
                chat_id: -1002048995957,
                message_id: +order.AllOrdersMessageId,
            });

            await this.bot.deleteMessage(-1002048995957, +order.ActiveOrderMessageId);
            //*
        } catch (error) {
            console.log(error);
        }
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
