import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PercentageGridService } from './percentageGrid.service';
import { PercentageGridController } from './percentageGrid.controller';

@Module({
    controllers: [PercentageGridController],
    providers: [PercentageGridService, PrismaService],
    exports: [PercentageGridService],
})
export class PercentageGridModule {}
