const dictionary: Record<string, string> = {
    pending: 'Ожидание', // Ожидает
    fulfilled: 'Закрыта', // Успешно
    rejectedByClient: 'Отказ КЛ', // Отказ клиента
    rejectedByMaster: 'Отклонена Мастером', // Отказ мастера
    cancelByClient: 'Отклонена КЛ',
    atWork: 'В работе', // В работе
    active: 'Активная', //активная заявка
    masterWentForSparePart: 'Мастер отъехал за ЗЧ', // Мастер отъехал за зч
    awaitingPayment: 'Ожидает сдачи', // ожидает оплаты
    all: 'Все',
    debt: 'Долг',
    missedCall: 'Недозвон',

    primary: 'Первичный',
    repeated: 'Повторный',
    guarantee: 'Гарантия',
    distribution: 'На распределении',
    transfer: 'ПЕРЕНОС',
    specialized: 'Профильная',
    notSpecialized: 'Непрофильная',
    airConditioner: 'Кондиционеры',

    //? Дни недели
    Monday: 'Понедельник',
    Tuesday: 'Вторник',
    Wednesday: 'Среда',
    Thursday: 'Четверг',
    Friday: 'Пятница',
    Saturday: 'Суббота',
    Sunday: 'Воскресенье',
};

export const translate = (key: string) => {
    return dictionary[key] || key;
};
