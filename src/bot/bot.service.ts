import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Order } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import * as TelegramBot from 'node-telegram-bot-api';
import * as moment from 'moment';

@Injectable()
export class BotService {
    constructor(private readonly prisma: PrismaService) {}

    userService = new UserService(this.prisma);

    async botMessage(masterId: number, msg: Order) {
        const bot = new TelegramBot(process.env.BOT_API_TOKEN, { polling: true });

        const master = this.userService.getById(masterId);

        const chatId = (await master).TelegramChatId;

        //? Формат отправки новой заявки в тг
        const newOrderMessage = `Новая заявка \nДата/Время: ${moment(msg.OrderDateTime).format(
            'DD/MM/YY, HH:mm',
        )} \nАдрес: ${msg.Address} \nВизит: ${msg.Visit} \nНомер: +${msg.ClientPhoneNumber} \nИмя клиента: ${
            msg.ClientName
        } \nИмя мастера: ${msg.MasterName} \nОзвучка: ${msg.AnnouncedPrice} \nОписание: ${msg.Description}`;
        //?

        /*  const buttons = [[{ text: 'Забрал', callback_data: 'cost' }]]; */

        const options = {
            /* reply_markup: {
                inline_keyboard: buttons,
            }, */
        };

        bot.sendMessage(+chatId, newOrderMessage, options).catch((error) => console.log(error));

        bot.on('callback_query', (msg) => {
            if (msg.data === 'cost') {
                bot.sendMessage(msg.from.id, 'Введи сумму (число)');
            } else bot.sendMessage(msg.from.id, 'Error');
        });
    }
}
