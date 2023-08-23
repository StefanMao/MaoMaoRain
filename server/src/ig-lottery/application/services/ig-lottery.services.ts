import { Injectable } from '@nestjs/common';
import { CreateIgLotteryDto } from '../dtos/create-ig-lottery.dto';

@Injectable()
export class IgLotteryService {
  private readonly igLotteries: any[] = [];

  create(createIgLotteryDto: CreateIgLotteryDto): any {
    const newIgLottery = { id: this.igLotteries.length + 1, ...createIgLotteryDto };
    this.igLotteries.push(newIgLottery);
    return newIgLottery;
  }

  findAll(): any[] {
    return this.igLotteries;
  }
}