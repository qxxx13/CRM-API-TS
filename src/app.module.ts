import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BotModule } from './bot/bot.module';
import { PromouterModule } from './promouter/promouter.module';

@Module({
    imports: [OrderModule, UserModule, AuthModule, BotModule, PromouterModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
