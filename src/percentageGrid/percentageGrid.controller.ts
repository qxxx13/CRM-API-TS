import { PercentageGrid, PercentageGridItem } from '@prisma/client';
import { PercentageGridService } from './percentageGrid.service';
import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('percentageGrid')
export class PercentageGridController {
    constructor(private readonly percentageGridService: PercentageGridService) {}

    @Get('')
    async getAll() {
        return await this.percentageGridService.getAll();
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return await this.percentageGridService.getById(id);
    }

    @Post('')
    @UsePipes(new ValidationPipe())
    async create(@Body() dto: PercentageGrid) {
        return this.percentageGridService.create(dto);
    }

    @Post('/item')
    @UsePipes(new ValidationPipe())
    async createItem(@Body() dto: PercentageGridItem) {
        return this.percentageGridService.createItem(dto);
    }

    @Post('/edit')
    @UsePipes(new ValidationPipe())
    async edit(@Body() dto: PercentageGrid) {
        return this.percentageGridService.edit(dto);
    }

    @Post('/edit/item')
    @UsePipes(new ValidationPipe())
    async editItem(@Body() dto: PercentageGridItem) {
        return this.percentageGridService.editItem(dto);
    }
}
