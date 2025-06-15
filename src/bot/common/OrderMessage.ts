import { Order, User, Visit } from '@prisma/client';
import * as moment from 'moment';
import { translate } from 'src/common/translate';
import { serverInstance } from './instances';

export const TelegramOrderMessage = async (order: Order) => {
    const orderDate = `${translate(moment(order.Date).format('dddd'))} ${moment(order.Date).format('DD.MM.YY')}`;
    const orderClientPhoneNumber = order.ClientPhoneNumber.replaceAll('-', '');

    const master = (await serverInstance.get(`user/${order.MasterId}`).then((res) => res.data)) as unknown as User;

    const comments = order.Comments ? `Комментарий: ${order.Comments}` : '';
    const debt = order.Debt ? `Долг: ${order.Debt}` : '';

    // Добавляем смайлики и форматирование для разных типов визитов
    const visitEmojiMap = {
        [Visit.primary]: '🆕', // Новый клиент
        [Visit.primaryUrgent]: '🚨🆕', // Срочный новый клиент
        [Visit.repeated]: '↩️', // Повторный визит
        [Visit.guarantee]: '🛡️', // Гарантия
    };

    const visitDisplay = `${visitEmojiMap[order.Visit] || ''} ${translate(order.Visit)}`.trim();

    if (order.Status === 'debt' || order.Status === 'awaitingPayment' || order.Status === 'fulfilled') {
        return `#${order.Id}
${translate(order.Status)}
——————

Мастер: ${master.UserName}

Визит: ${visitDisplay}
Дата: ${orderDate}
Время: ${order.Time}
Номер: ${orderClientPhoneNumber}
Город: ${order.City}
Адрес: ${order.Address}
Клиент: ${order.ClientName}
Имя мастера: ${order.MasterName}
Озвучка: ${order.AnnouncedPrice}
Тип: ${translate(order.Type)}
Описание: ${order.Description}
——————

К сдаче: ${order.CompanyShare}

Забрал: ${order.Total}
Расход: ${order.Expenses}
Итог: ${order.Price}
${debt}

${comments}
`;
    } else {
        return `#${order.Id}
${translate(order.Status)}
——————

Мастер: ${master.UserName}

Визит: ${visitDisplay}
Дата: ${orderDate}
Время: ${order.Time}
Номер: ${orderClientPhoneNumber}
Город: ${order.City}
Адрес: ${order.Address}
Клиент: ${order.ClientName}
Имя мастера: ${order.MasterName}
Озвучка: ${order.AnnouncedPrice}
Тип: ${translate(order.Type)}
Описание: ${order.Description}

${comments}
`;
    }
};
