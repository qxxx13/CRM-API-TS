import { Controller, Get, Param } from '@nestjs/common';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Get(':id')
    async getCompanyById(@Param('id') id: string) {
        return await this.companyService.getById(id);
    }
}
