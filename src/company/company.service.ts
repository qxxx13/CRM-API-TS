import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CompanyService {
    constructor(private prisma: PrismaService) {}

    async getById(id: string) {
        const company = await this.prisma.company.findFirst({
            where: {
                Id: +id,
            },
        });

        if (!company) {
            return new NotFoundException('Company not found!');
        } else return company;
    }
}
