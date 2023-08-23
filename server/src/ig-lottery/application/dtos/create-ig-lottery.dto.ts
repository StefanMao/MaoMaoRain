import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIgLotteryDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  readonly email: string;
}
