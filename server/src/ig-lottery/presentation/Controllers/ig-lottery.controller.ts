import { Controller, Get, Post, Body } from '@nestjs/common';
import { IgLotteryService } from '../../application/services/ig-lottery.services';
import { CreateIgLotteryDto } from '../../application/dtos/create-ig-lottery.dto';

@Controller('ig-lottery')
export class IgLotteryController {
  constructor(private readonly igLotteryService: IgLotteryService) {}

  @Post()
  async create(@Body() createIgLotteryDto: CreateIgLotteryDto) {
    // 使用 igLotteryService 創建 IG 抽獎
    const result = await this.igLotteryService.create(createIgLotteryDto);
    return result;
  }

  @Get()
  findAll() {
    // 使用 igLotteryService 查找所有 IG 抽獎
    const igLotteries = this.igLotteryService.findAll();
    return igLotteries;
  }
}
