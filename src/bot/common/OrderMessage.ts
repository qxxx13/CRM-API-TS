import { Order } from '@prisma/client';
import * as moment from 'moment';
import { translate } from 'src/common/translate';

export const newOrderMessage = (order: Order) => {
    const orderDate = moment(order.Date).format('DD.MM.YY');
    const orderClientPhoneNumber = order.ClientPhoneNumber.replaceAll('-', '');

    const message = `#${order.Id}
${translate(order.Status)}
——————
Дата: ${orderDate}
Время: ${order.Time}
Номер: ${orderClientPhoneNumber}
Город: ${order.City}
Адрес: ${order.Address}
Визит: ${translate(order.Visit)}
Клиент: ${order.ClientName}
Имя мастера: ${order.MasterName}
Озвучка: ${order.AnnouncedPrice}
Описание: ${order.Description}`;

    return message;
};

export const closeOrderMessage = (order: Order) => {
    const message = `#${order.Id}
Закрыта

Номер: ${order.ClientPhoneNumber.replaceAll('-', '')}
Адрес: ${order.Address}
——————
К сдаче: ${order.CompanyShare}

Забрал: ${order.Total}
Расход: ${order.Expenses}
Итог: ${order.Price}`;

    const messageWithDebt = `#${order.Id}
ДОЛГ

Номер: ${order.ClientPhoneNumber.replaceAll('-', '')}
Адрес: ${order.Address}
——————
К сдаче: ${order.CompanyShare}

Забрал: ${order.Total}
Расход: ${order.Expenses}
Долг: ${order.Debt}
Итог: ${order.Price}`;

    if (order.Debt === 0) {
        return message;
    } else {
        return messageWithDebt;
    }
};

export const closeOrderAllMessage = (order: Order) => {
    const orderDate = moment(order.Date).format('DD.MM.YY');
    const orderClientPhoneNumber = order.ClientPhoneNumber.replaceAll('-', '');

    const message = `#${order.Id}
Закрыта
——————
Дата: ${orderDate}
Время: ${order.Time}
Номер: ${orderClientPhoneNumber}
Город: ${order.City}
Адрес: ${order.Address}
Визит: ${translate(order.Visit)}
Клиент: ${order.ClientName}
Имя мастера: ${order.MasterName}
Озвучка: ${order.AnnouncedPrice}
Описание: ${order.Description}

Забрал: ${order.Total}
Расход: ${order.Expenses}
Итог: ${order.Price}`;

    const messageWithDebt = `#${order.Id}
ДОЛГ
——————
Дата: ${orderDate}
Время: ${order.Time}
Номер: ${orderClientPhoneNumber}
Город: ${order.City}
Адрес: ${order.Address}
Визит: ${translate(order.Visit)}
Клиент: ${order.ClientName}
Имя мастера: ${order.MasterName}
Озвучка: ${order.AnnouncedPrice}
Описание: ${order.Description}

Забрал: ${order.Total}
Расход: ${order.Expenses}
Долг: ${order.Debt}
Итог: ${order.Price}`;

    if (order.Debt === 0) {
        return message;
    } else {
        return messageWithDebt;
    }
};
