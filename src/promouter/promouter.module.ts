import { Module } from '@nestjs/common';
import { PromouterService } from './promouter.service';
import { PromouterController } from './promouter.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
    controllers: [PromouterController],
    providers: [PromouterService, PrismaService],
    exports: [PromouterService],
})
export class PromouterModule {}
