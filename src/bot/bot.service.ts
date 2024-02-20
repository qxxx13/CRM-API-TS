import { Injectable } from '@nestjs/common';
import { Order, User } from '@prisma/client';
import * as TelegramBot from 'node-telegram-bot-api';
import * as moment from 'moment';
import { translate } from 'src/common/translate';
import axios from 'axios';

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

        const orderDate = moment(order.Date).format('DD.MM.YY');

        const orderClientPhoneNumber = order.ClientPhoneNumber.replaceAll('-', '');

        const newOrderMessage = `#${order.Id}
${translate(order.Status)}
——————
Дата: ${orderDate}
Время: ${order.Time}
Номер: ${orderClientPhoneNumber}
Адрес: ${order.Address}
Визит: ${translate(order.Visit)}
Клиент: ${order.ClientName}
Имя мастера: ${order.MasterName}
Озвучка: ${order.AnnouncedPrice}
Описание: ${order.Description}`;

        let msgId: number;

        await this.bot
            .sendMessage(+chatId, newOrderMessage, { message_thread_id: +messageThreadId })
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

        await this.bot.editMessageText(newOrderMessage, {
            chat_id: chatId,
            message_id: msgId,
            reply_markup: takeOrderOptions,
        });
    }

    async takeOrderBotMessage(chatId: string, messageId: string, orderId: string) {
        const OrderOptions = {
            inline_keyboard: [[{ text: 'В работе', url: `http://77.91.84.85/work/${chatId}/${messageId}/${orderId}` }]],
        };

        const order: Order = await axios.get(`http://77.91.84.85:5555/api/orders/${orderId}`).then((res) => res.data);
        const newMessage = `#${order.Id}
Принята
——————
Дата: ${moment(order.Date).format('DD.MM.YY')}
Время: ${order.Time}
Номер: ${order.ClientPhoneNumber.replaceAll('-', '')}
Адрес: ${order.Address}
Визит: ${translate(order.Visit)}
Клиент: ${order.ClientName}
Имя мастера: ${order.MasterName}
Озвучка: ${order.AnnouncedPrice}
Описание: ${order.Description}`;

        this.bot.editMessageText(newMessage, {
            chat_id: chatId,
            message_id: +messageId,
            reply_markup: OrderOptions,
        });
    }

    async atWorkOrderBotMessage(chatId: string, messageId: string, orderId: string) {
        const OrderOptions = {
            inline_keyboard: [[{ text: 'В работе', url: `http://77.91.84.85/work/${chatId}/${messageId}/${orderId}` }]],
        };

        const order: Order = await axios.get(`http://77.91.84.85:5555/api/orders/${orderId}`).then((res) => res.data);
        const newMessage = `#${order.Id}
В работе
——————
Дата: ${moment(order.Date).format('DD.MM.YY')}
Время: ${order.Time}
Номер: ${order.ClientPhoneNumber.replaceAll('-', '')}
Адрес: ${order.Address}
Визит: ${translate(order.Visit)}
Клиент: ${order.ClientName}
Имя мастера: ${order.MasterName}
Озвучка: ${order.AnnouncedPrice}
Описание: ${order.Description}`;

        this.bot.editMessageText(newMessage, {
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
    /* async createOrderBotMessage(masterId: number, order: Order) {
        const bot = new TelegramBot(process.env.BOT_API_TOKEN, { polling: true });

        const master = await this.userService.getById(masterId);

        const chatId = master.TelegramChatId;
        const messageId = master.MessageId;

        const orderDate = moment(order.Date).format('DD.MM.YY');

        const orderClientPhoneNumber = order.ClientPhoneNumber.replaceAll('-', '');

        const newOrderMessage = `#${order.Id}
${translate(order.Status)}
——————
Дата: ${orderDate}
Время: ${order.Time}
Номер: ${orderClientPhoneNumber}
Адрес: ${order.Address}
Визит: ${translate(order.Visit)}
Клиент: ${order.ClientName}
Имя мастера: ${order.MasterName}
Озвучка: ${order.AnnouncedPrice}
Описание: ${order.Description}`;

        const newOrderMessageArr = newOrderMessage.split('\n');

        const takeOrderOptions = {
            message_thread_id: +messageId,
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Принять', callback_data: 'Take' },
                        { text: 'Отклонить', callback_data: 'Reject' },
                    ],
                ],
            },
        };

        const OrderOptions = {
            inline_keyboard: [
                [
                    { text: 'В работе', callback_data: 'AtWork' },
                    {
                        text: 'Закрыть заявку',
                        url: `77.91.84.85/closeorder/${order.Id}`,
                        callback_data: 'CloseOrder',
                    },
                ],
            ],
        };

        const atWorkOrderOptions = {
            inline_keyboard: [
                [
                    { text: 'Отъехал за ЗЧ', callback_data: 'WentForSparePart' },
                    {
                        text: 'Закрыть заявку',
                        url: `77.91.84.85/closeorder/${order.Id}`,
                        callback_data: 'CloseOrder',
                    },
                ],
            ],
        };

        const ReturnToOrderOptions = {
            inline_keyboard: [[{ text: 'Вернулся', callback_data: 'ReturnToOrder' }]],
        };

        await bot
            .sendMessage(+chatId, newOrderMessage, takeOrderOptions)
            .catch((error) => console.log(error))
            .then(
                async (msg: TelegramBot.Message) =>
                    await this.orderService.toggleMessageId(String(order.Id), String(msg.message_id)),
            );

        //bot.sendMessage(-1002048995957, newOrderMessage, { message_thread_id: 4 }).catch((error) => console.log(error));

        bot.on('callback_query', async (callbackQuery) => {
            const action = callbackQuery.data;
            const msg = callbackQuery.message;
            const opt = {
                chat_id: msg.chat.id,
                message_id: msg.message_id,
                message_thread_id: msg.message_thread_id,
            };

            const orderMessageId = await this.orderService.getMessageId(String(order.Id));

            if (action === 'Take') {
                await this.orderService.toggleStatus(String(order.Id), 'active');

                newOrderMessageArr[1] = 'Принята';

                const editedOrderMessage = newOrderMessageArr.join('\n');

                await bot.editMessageText(editedOrderMessage, {
                    chat_id: opt.chat_id,
                    message_id: +orderMessageId,
                    reply_markup: OrderOptions,
                });
            }

            if (action === 'Reject') {
                await this.orderService.toggleStatus(String(order.Id), 'rejectedByMaster');
                await bot.sendMessage(opt.chat_id, 'Отменил заявку', { message_thread_id: opt.message_thread_id });
                await bot.deleteMessage(opt.chat_id, opt.message_id);
            }

            if (action === 'AtWork') {
                await this.orderService.toggleStatus(String(order.Id), 'atWork');
                await this.userService.toggleStatus(String(masterId), 'atWork');

                newOrderMessageArr[1] = 'В работе';

                const editedOrderMessage = newOrderMessageArr.join('\n');

                await bot.editMessageText(editedOrderMessage, {
                    chat_id: opt.chat_id,
                    message_id: +orderMessageId,
                    reply_markup: atWorkOrderOptions,
                });
            }

            if (action === 'WentForSparePart') {
                await this.userService.toggleStatus(String(masterId), 'wentForSparePart');
                await this.orderService.toggleStatus(String(order.Id), 'masterWentForSparePart');
                newOrderMessageArr[1] = 'Отъехал за ЗЧ';

                const editedOrderMessage = newOrderMessageArr.join('\n');

                await bot.editMessageText(editedOrderMessage, {
                    chat_id: opt.chat_id,
                    message_id: +orderMessageId,
                    reply_markup: ReturnToOrderOptions,
                });
            }

            if (action === 'ReturnToOrder') {
                await this.userService.toggleStatus(String(masterId), 'atWork');
                await this.orderService.toggleStatus(String(order.Id), 'atWork');

                newOrderMessageArr[1] = 'В работе';

                const editedOrderMessage = newOrderMessageArr.join('\n');

                await bot.editMessageText(editedOrderMessage, {
                    chat_id: opt.chat_id,
                    message_id: +orderMessageId,
                    reply_markup: atWorkOrderOptions,
                });
            }
        });
    }

    async closeOrderMessage(masterId: number, orderId: number) {
        const bot = new TelegramBot(process.env.BOT_API_TOKEN, { polling: true });

        const master = await this.userService.getById(masterId);

        const chatId = master.TelegramChatId;

        const order = await this.orderService.getById(String(orderId));

        const editedOrderMessage = `#${orderId}
Закрыта

Номер КЛ: ${order.ClientPhoneNumber}
Адрес: ${order.Address}
——————
К сдаче: ${order.CompanyShare}

Забрал: ${order.Total}
Расход: ${order.Expenses}
Итог: ${order.Price}`;

        bot.editMessageText(editedOrderMessage, {
            chat_id: chatId,
            message_id: +order.MessageId,
        });
    } */
}
