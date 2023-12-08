import { Status, User, Visit } from '@prisma/client';

export type OrderDto = {
    data: {
        Id: number;
        Description: string;
        Address: string;
        OrderDateTime: Date;
        Visit: Visit;
        ClientPhoneNumber: string;
        ClientName: string;
        Master: User;
        MasterId: number;
        MasterName: string;
        AnnouncedPrice: number;
        Price: number;
        Status: Status;
        TelephoneRecord: string;
        Latitude: number;
        Longitude: number;
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
