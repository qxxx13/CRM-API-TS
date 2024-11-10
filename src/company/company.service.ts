import { Injectable, NotFoundException } from '@nestjs/common';
import { Company } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CompanyService {
    constructor(private prisma: PrismaService) {}

    async getAll() {
        const companyList = await this.prisma.company.findMany();

        return companyList;
    }

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

    async create(dto: Company) {
        const newCompany = await this.prisma.company.create({
            data: dto,
        });

        return newCompany;
    }

    async edit(dto: Company) {
        const editCompany = await this.prisma.company.update({
            where: { Id: dto.Id },
            data: dto,
        });

        return editCompany;
    }

    async toggleTotalCompanyMoney(id: number, sum: number) {
        const company = await this.prisma.company.findFirst({ where: { Id: id } });
        const total = company.TotalCompanyMoney;
        const past = company.PastTotalCompanyMoney;

        /* console.log('sum:', sum, 'total:', total, 'past:', past); */

        if (sum < total) {
            await this.prisma.company.update({ where: { Id: id }, data: { PastTotalCompanyMoney: total } });
            return await this.prisma.company.update({ where: { Id: id }, data: { TotalCompanyMoney: sum } });
        } else {
            const temp = sum - total;
            const salary = company.SalaryToSend + temp;
            await this.prisma.company.update({ where: { Id: id }, data: { PastTotalCompanyMoney: total } });
            await this.prisma.company.update({ where: { Id: id }, data: { SalaryToSend: salary } });
            return await this.prisma.company.update({ where: { Id: id }, data: { TotalCompanyMoney: sum } });
        }
    }

    async toggleSalaryToSend(id: number, sum: number) {
        const company = await this.prisma.company.findFirst({ where: { Id: id } });
        const total = company.TotalCompanyMoney;

        const temp = total - sum;

        await this.prisma.company.update({ where: { Id: id }, data: { PastTotalCompanyMoney: total } });
        await this.prisma.company.update({ where: { Id: id }, data: { TotalCompanyMoney: temp } });
        return await this.prisma.company.update({ where: { Id: id }, data: { SalaryToSend: 0 } });
    }

    async addMoneyToCompany(id: number, sum: number) {
        const company = await this.prisma.company.findFirst({ where: { Id: id } });
        const total = company.TotalCompanyMoney;
        const salary = company.SalaryToSend;

        const newTotal = total + sum;
        const newSalary = salary + sum;

        await this.prisma.company.update({ where: { Id: id }, data: { PastTotalCompanyMoney: total } });
        await this.prisma.company.update({ where: { Id: id }, data: { TotalCompanyMoney: newTotal } });
        return await this.prisma.company.update({ where: { Id: id }, data: { SalaryToSend: newSalary } });
    }
}
