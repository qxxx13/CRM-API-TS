import { Injectable, NotFoundException } from '@nestjs/common';
import { PercentageGrid, PercentageGridItem } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PercentageGridService {
    constructor(private prisma: PrismaService) {}

    async getAll() {
        const percentageGridList = await this.prisma.percentageGrid.findMany({ orderBy: { Id: 'desc' } });

        return percentageGridList;
    }

    async getById(id: string) {
        const percentageGrid = await this.prisma.percentageGrid.findFirst({
            where: {
                Id: +id,
            },
            orderBy: { Id: 'desc' },
        });

        const percentageGridItems = await this.prisma.percentageGridItem.findMany({
            where: {
                PercentageGridId: +id,
            },
            orderBy: { Id: 'desc' },
        });

        if (!percentageGrid) {
            return new NotFoundException('PercentageGrid not found!');
        } else return { GridId: percentageGrid.Id, Name: percentageGrid.Name, Items: percentageGridItems };
    }

    async create(dto: PercentageGrid) {
        const newPercentageGrid = await this.prisma.percentageGrid.create({
            data: dto,
        });

        return newPercentageGrid;
    }

    async createItem(dto: PercentageGridItem) {
        const newPercentageGridItem = await this.prisma.percentageGridItem.create({
            data: dto,
        });

        return newPercentageGridItem;
    }

    async edit(dto: PercentageGrid) {
        const editPercentageGrid = await this.prisma.percentageGrid.update({
            where: { Id: dto.Id },
            data: dto,
        });

        return editPercentageGrid;
    }

    async editItem(dto: PercentageGridItem) {
        const editPercentageGridItem = await this.prisma.percentageGridItem.update({
            where: { Id: dto.Id },
            data: dto,
        });

        return editPercentageGridItem;
    }
}
