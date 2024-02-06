import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'src/prisma.service';
import { BotModule } from 'src/bot/bot.module';

@Module({
    imports: [forwardRef(() => BotModule)],
    controllers: [OrderController],
    providers: [OrderService, PrismaService],
    exports: [OrderService],
})
export class OrderModule {}
