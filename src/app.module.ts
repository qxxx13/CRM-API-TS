import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BotModule } from './bot/bot.module';
import { PromouterModule } from './promouter/promouter.module';
import { FilesModule } from './files/files.module';
import { CompanyModule } from './company/company.module';
import { PercentageGridModule } from './percentageGrid/percentageGrid.module';

@Module({
    imports: [
        OrderModule,
        UserModule,
        AuthModule,
        BotModule,
        PromouterModule,
        FilesModule,
        CompanyModule,
        PercentageGridModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
