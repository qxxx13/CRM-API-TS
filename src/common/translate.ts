const dictionary: Record<string, string> = {
    pending: 'Не принята',
    fulfilled: 'Закрыта',
    rejectedByClient: 'Отклонена клиентом',
    rejectedByMaster: 'Отклонена мастером',
    atWork: 'В работе',
    active: 'Принята',
    masterWentForSparePart: 'Отъехал за ЗЧ',

    primary: 'Первичный',
    repeated: 'Повторный',
    guarantee: 'Гарантия',
};

export const translate = (key: string) => {
    return dictionary[key] || key;
};
