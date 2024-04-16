import { Order, User } from '@prisma/client';
import * as moment from 'moment';
import { translate } from 'src/common/translate';
import { serverInstance } from './instances';

export const TelegramOrderMessage = async (order: Order) => {
    const orderDate = moment(order.Date).format('DD.MM.YY');
    const orderClientPhoneNumber = order.ClientPhoneNumber.replaceAll('-', '');

    const master = (await serverInstance.get(`user/${order.MasterId}`).then((res) => res.data)) as unknown as User;

    const comments = order.Comments ? `Комментарий: ${order.Comments}` : '';
    const debt = order.Debt ? `Долг: ${order.Debt}` : '';

    if (order.Status === 'debt' || order.Status === 'awaitingPayment' || order.Status === 'fulfilled') {
        return `#${order.Id}
${translate(order.Status)}

Номер: ${order.ClientPhoneNumber.replaceAll('-', '')}
Адрес: ${order.Address}
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

Визит: ${translate(order.Visit)}
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

    /* switch (order.Status) {
        case 'active':
            return `#${order.Id}
${translate(order.Status)}
——————

Мастер: ${master.UserName}

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

        case 'atWork':
            return `#${order.Id}
${translate(order.Status)}
——————

Мастер: ${master.UserName}

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

        case 'rejectedByClient':
            return `#${order.Id}
${translate(order.Status)}
——————

Мастер: ${master.UserName}

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

        case 'rejectedByMaster':
            return `#${order.Id}
${translate(order.Status)}
——————

Мастер: ${master.UserName}

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

        case 'takeToSD':
            return `#${order.Id}
${translate(order.Status)}
——————

Мастер: ${master.UserName}

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

        case 'awaitingPayment':
            return `#${order.Id}
Ожидает сдачи

Номер: ${order.ClientPhoneNumber.replaceAll('-', '')}
Адрес: ${order.Address}
——————

К сдаче: ${order.CompanyShare}

Забрал: ${order.Total}
Расход: ${order.Expenses}
Итог: ${order.Price}

${comments}
`;

        case 'fulfilled':
            return `#${order.Id}
Закрыта

Мастер: ${master.UserName}

Номер: ${order.ClientPhoneNumber.replaceAll('-', '')}
Адрес: ${order.Address}
——————
К сдаче: ${order.CompanyShare}

Забрал: ${order.Total}
Расход: ${order.Expenses}
Итог: ${order.Price}

${comments}
`;

        case 'masterWentForSparePart':
            return `#${order.Id}
${translate(order.Status)}
——————

Мастер: ${master.UserName}

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

        case 'pending':
            return `#${order.Id}
${translate(order.Status)}
——————

Мастер: ${master.UserName}

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

        case 'distribution':
            return `#${order.Id}
${translate(order.Status)}
——————

Мастер: ${master.UserName}

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

        case 'transfer':
            return `#${order.Id}
${translate(order.Status)}
——————

Мастер: ${master.UserName}

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

        case 'debt':
            return `#${order.Id}
ДОЛГ

Мастер: ${master.UserName}

Номер: ${order.ClientPhoneNumber.replaceAll('-', '')}
Адрес: ${order.Address}
——————
К сдаче: ${order.CompanyShare}

Забрал: ${order.Total}
Расход: ${order.Expenses}
Долг: ${order.Debt}
Итог: ${order.Price}

${comments}`;
    } */
};
