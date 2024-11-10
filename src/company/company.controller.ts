import { Body, Controller, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from '@prisma/client';

@Controller('company')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Get('')
    async getAllCompany() {
        return await this.companyService.getAll();
    }

    @Get(':id')
    async getCompanyById(@Param('id') id: string) {
        return await this.companyService.getById(id);
    }

    @Post('')
    @UsePipes(new ValidationPipe())
    async create(@Body() dto: Company) {
        return this.companyService.create(dto);
    }

    @Post('/edit')
    @UsePipes(new ValidationPipe())
    async edit(@Body() dto: Company) {
        return this.companyService.edit(dto);
    }

    @Patch('/toggleTotalCompanyMoney')
    async toggleIncome(@Query('companyId') companyId: string, @Query('sum') sum: string) {
        return await this.companyService.toggleTotalCompanyMoney(+companyId, +sum);
    }

    @Patch('/toggleSalaryToSend')
    async toggleSalaryToSend(@Query('companyId') companyId: string, @Query('sum') sum: string) {
        return await this.companyService.toggleSalaryToSend(+companyId, +sum);
    }

    @Patch('/addMoneyToCompany')
    async addMoneyToCompany(@Query('companyId') companyId: string, @Query('sum') sum: string) {
        return await this.companyService.addMoneyToCompany(+companyId, +sum);
    }
}
