import { OrderStatus, User, Visit } from '@prisma/client';

export type OrderDto = {
    data: {
        Id: number;
        Description: string;
        Address: string;
        Date: Date;
        Time?: string;
        Visit: Visit;
        ClientPhoneNumber: string;
        ClientName?: string;
        MasterId: number;
        AnnouncedPrice: string;
        Status: OrderStatus;
        Price: string;
        TelephoneRecord?: string;
        Latitude?: number;
        Longitude?: number;
        MasterName?: string;
        Master: User;
    }[];

    meta: {
        total: number;
        lastPage: number;
        currentPage: number;
        perPage: number;
        prev: number;
        next: number;
    };
};
