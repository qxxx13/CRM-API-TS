import { Order } from '@prisma/client';
import moment from 'moment';
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
Адрес: ${order.Address}
Визит: ${translate(order.Visit)}
Клиент: ${order.ClientName}
Имя мастера: ${order.MasterName}
Озвучка: ${order.AnnouncedPrice}
Описание: ${order.Description}`;

    return message;
};
