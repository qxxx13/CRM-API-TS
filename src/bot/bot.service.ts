import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Order } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import * as TelegramBot from 'node-telegram-bot-api';
import * as moment from 'moment';
import { OrderService } from 'src/order/order.service';
import { translate } from 'src/common/translate';

@Injectable()
export class BotService {
    constructor(
        @Inject(forwardRef(() => OrderService)) private readonly orderService: OrderService,
        @Inject(UserService) private readonly userService: UserService,
    ) {}

    async botMessage(masterId: number, order: Order) {
        const bot = new TelegramBot(process.env.BOT_API_TOKEN, { polling: true });

        const master = this.userService.getById(masterId);

        const chatId = (await master).TelegramChatId;
        const messageId = (await master).MessageId;

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

        bot.sendMessage(+chatId, newOrderMessage, takeOrderOptions).catch((error) => console.log(error));
        //bot.sendMessage(-1002048995957, newOrderMessage, { message_thread_id: 4 }).catch((error) => console.log(error));

        bot.on('callback_query', async (callbackQuery) => {
            const action = callbackQuery.data;
            const msg = callbackQuery.message;
            const opt = {
                chat_id: msg.chat.id,
                message_id: msg.message_id,
                message_thread_id: msg.message_thread_id,
            };

            this.orderService.toggleMessageId(String(order.Id), String(opt.message_id));

            if (action === 'Take') {
                const orderMessageId = await this.orderService.getMessageId(String(order.Id));
                this.orderService.toggleStatus(String(order.Id), 'active');

                newOrderMessageArr[1] = 'Принята';

                const editedOrderMessage = newOrderMessageArr.join('\n');

                bot.editMessageText(editedOrderMessage, {
                    chat_id: opt.chat_id,
                    message_id: +orderMessageId,
                    reply_markup: OrderOptions,
                });
            }

            if (action === 'Reject') {
                this.orderService.toggleStatus(String(order.Id), 'rejectedByMaster');
                bot.sendMessage(opt.chat_id, 'Отменил заявку', { message_thread_id: opt.message_thread_id });
                bot.deleteMessage(opt.chat_id, opt.message_id);
            }

            if (action === 'AtWork') {
                const orderMessageId = await this.orderService.getMessageId(String(order.Id));
                this.orderService.toggleStatus(String(order.Id), 'atWork');
                this.userService.toggleStatus(String(masterId), 'atWork');

                newOrderMessageArr[1] = 'В работе';

                const editedOrderMessage = newOrderMessageArr.join('\n');

                bot.editMessageText(editedOrderMessage, {
                    chat_id: opt.chat_id,
                    message_id: +orderMessageId,
                    reply_markup: atWorkOrderOptions,
                });
            }

            if (action === 'WentForSparePart') {
                const orderMessageId = await this.orderService.getMessageId(String(order.Id));
                newOrderMessageArr[1] = 'Отъехал за ЗЧ';

                const editedOrderMessage = newOrderMessageArr.join('\n');

                bot.editMessageText(editedOrderMessage, {
                    chat_id: opt.chat_id,
                    message_id: +orderMessageId,
                    reply_markup: ReturnToOrderOptions,
                });

                this.userService.toggleStatus(String(masterId), 'wentForSparePart');
            }

            if (action === 'ReturnToOrder') {
                bot.editMessageReplyMarkup(atWorkOrderOptions, opt);
                this.userService.toggleStatus(String(masterId), 'atWork');
            }
        });
    }
}
