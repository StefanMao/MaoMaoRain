import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IgLotteryModule } from './ig-lottery/ig-lottery.module';

@Module({
  imports: [IgLotteryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
