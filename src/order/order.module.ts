import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'src/prisma.service';
import { BotModule } from 'src/bot/bot.module';
import { FilesService } from 'src/files/files.service';

@Module({
    imports: [forwardRef(() => BotModule)],
    controllers: [OrderController],
    providers: [OrderService, PrismaService, FilesService],
    exports: [OrderService],
})
export class OrderModule {}
