import { Module, forwardRef } from '@nestjs/common';
import { BotService } from './bot.service';
import { OrderModule } from 'src/order/order.module';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [forwardRef(() => UserModule), forwardRef(() => OrderModule)],
    providers: [BotService],
    exports: [BotService],
})
export class BotModule {}
