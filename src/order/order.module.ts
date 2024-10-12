import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'src/prisma.service';
import { FilesService } from 'src/files/files.service';

@Module({
    controllers: [OrderController],
    providers: [OrderService, PrismaService, FilesService],
    exports: [OrderService],
})
export class OrderModule {}
