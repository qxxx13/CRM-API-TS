import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [OrderModule, UserModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
