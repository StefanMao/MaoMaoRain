import { Module } from '@nestjs/common';
import { IgLotteryController } from './presentation/controllers/ig-lottery.controller';
import { IgLotteryService } from './application/services/ig-lottery.services';

@Module({
  controllers: [IgLotteryController],
  providers: [IgLotteryService],
  exports: [],
})
export class IgLotteryModule {}