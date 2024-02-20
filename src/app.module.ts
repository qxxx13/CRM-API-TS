import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BotModule } from './bot/bot.module';

@Module({
    imports: [OrderModule, UserModule, AuthModule, BotModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
