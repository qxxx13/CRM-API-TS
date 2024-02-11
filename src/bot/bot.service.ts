import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Order } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import * as TelegramBot from 'node-telegram-bot-api';
import * as moment from 'moment';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class BotService {
    constructor(
        @Inject(forwardRef(() => OrderService)) private readonly orderService: OrderService,
        @Inject(UserService) private readonly userService: UserService,
    ) {}

    async botMessage(masterId: number, order: Order) {
        const bot = new TelegramBot(process.env.BOT_API_TOKEN, { polling: true });

        const master = this.userService.getById(masterId);

        const interestRate = (await master).InterestRate / 100;

        const chatId = (await master).TelegramChatId;
        const messageId = (await master).MessageId;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { Date, ClientPhoneNumber, Latitude, Longitude, MasterId, TelephoneRecord, ...other } = order;

        const orderDate = moment(Date).format('DD.MM.YY');

        const orderClientPhoneNumber = ClientPhoneNumber.replaceAll('-', '');

        const newOrderMessageArr = Object.entries(other).map(([key, value]) => {
            let newOrderMessage = '';
            if (value !== null && value !== '-') {
                newOrderMessage = `${key}: ${value} \n`;
            }
            return newOrderMessage;
        });

        newOrderMessageArr.unshift(`Date: ${orderDate} \n`, `ClientPhoneNumber: ${orderClientPhoneNumber} \n`);

        const newOrderMessage = newOrderMessageArr.join(' ');

        const takeOrderOptions = {
            message_thread_id: +messageId,
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Взять', callback_data: 'Take' },
                        { text: 'Отклонить', callback_data: 'Reject' },
                    ],
                ],
            },
        };

        const OrderOptions = {
            inline_keyboard: [
                [
                    { text: 'В работе', callback_data: 'AtWork' },
                    { text: 'Отъехал за ЗЧ', callback_data: 'WentForSparePart' },
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
                    { text: 'Зашел', callback_data: 'CameIn' },
                    { text: 'Отъехал за ЗЧ', callback_data: 'WentForSparePart' },
                    {
                        text: 'Закрыть заявку',
                        url: `77.91.84.85/closeorder/${order.Id}`,
                        callback_data: 'CloseOrder',
                    },
                ],
            ],
        };

        const cameInOrderOptions = {
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

        const nullOpt = {
            inline_keyboard: [[]],
        };

        bot.sendMessage(+chatId, newOrderMessage, takeOrderOptions).catch((error) => console.log(error));
        //bot.sendMessage(-1002048995957, newOrderMessage, { message_thread_id: 4 }).catch((error) => console.log(error));

        bot.on('callback_query', (callbackQuery) => {
            const action = callbackQuery.data;
            const msg = callbackQuery.message;
            const opt = {
                chat_id: msg.chat.id,
                message_id: msg.message_id,
                message_thread_id: msg.message_thread_id,
            };

            if (action === 'Take') {
                bot.editMessageReplyMarkup(OrderOptions, opt);
            }

            if (action === 'Reject') {
                bot.sendMessage(opt.chat_id, 'Отменил заявку', { message_thread_id: opt.message_thread_id });
                bot.deleteMessage(opt.chat_id, opt.message_id);
            }

            if (action === 'AtWork') {
                this.orderService.toggleStatus(String(order.Id), 'atWork');
                this.userService.toggleStatus(String(masterId), 'atWork');

                const index = newOrderMessageArr.indexOf('Status: pending \n');
                newOrderMessageArr[index] = 'Status: atWork \n';
                const editOrderMessage = newOrderMessageArr.join(' ');
                bot.editMessageText(editOrderMessage, {
                    chat_id: opt.chat_id,
                    message_id: opt.message_id,
                    reply_markup: atWorkOrderOptions,
                });
            }

            if (action === 'CameIn') {
                bot.editMessageReplyMarkup(cameInOrderOptions, opt);
                this.userService.toggleStatus(String(masterId), 'atWork');
            }

            if (action === 'WentForSparePart') {
                bot.editMessageReplyMarkup(ReturnToOrderOptions, opt);
                this.userService.toggleStatus(String(masterId), 'wentForSparePart');
            }

            if (action === 'ReturnToOrder') {
                bot.editMessageReplyMarkup(cameInOrderOptions, opt);
                this.userService.toggleStatus(String(masterId), 'atWork');
            }

            if (action === 'CloseOrder') {
                bot.editMessageReplyMarkup(nullOpt, opt);

                const sumToSend = +order.Price * interestRate;

                bot.sendMessage(
                    opt.chat_id,
                    `Сумма для перевода: ${sumToSend} \n +79185345972 - только Тинькофф \n Андрей Андреевич Т. \n Фото чека в чат Обсуждение`,
                    opt,
                );

                const index = newOrderMessageArr.indexOf('Status: atWork \n');
                newOrderMessageArr[index] = 'Status: fulfilled \n';
                const editOrderMessage = newOrderMessageArr.join(' ');
                bot.editMessageText(editOrderMessage, {
                    chat_id: opt.chat_id,
                    message_id: opt.message_id,
                });

                this.orderService.toggleStatus(String(order.Id), 'fulfilled');
            }
        });
    }
}
