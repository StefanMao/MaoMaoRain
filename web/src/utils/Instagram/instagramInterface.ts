import { FaceBookFanAccount } from '../../utils/facebook/faceBookSdkTypes';
export interface IIgUser {
  id: string;
  username: string;
}
export interface IInstagramComment {
  id: string;
  text: string;
  username: string;
  timestamp: string;
  like_count: number;
  from: IIgUser;
}

export interface IInstagramCommentData {
  data?: IInstagramComment[];
}

export interface IInstagramStore {
  selectedBusinessAccount: FaceBookFanAccount | null;
  selectedPost: IInstagramPost | null;
  currentPostComments: IInstagramComment[] | [];
  currentLotterySetting: ILotteryActivitySettings;
  currentQualifiedComments: IInstagramComment[] | [];
  currentNonQualifiedComments: IInstagramComment[] | [];
  islotterySettingFormError: boolean;
  isActivitySettingApplied: boolean;
  performLotteryResult: IPerformLotteryResult | null;
}

export interface IInstagramPost {
  media_type: string;
  media_url: string;
  comments?: IInstagramCommentData;
  caption: string;
  timestamp: string;
  id: string;
  shortcode: string;
}

export interface IInstagramMediaApi {
  data: IInstagramPost[];
  paging?: object;
}

// 抽獎活動時間
export interface ILotteryActivityTime {
  startDate: string;
  endDate: string;
}

// 獎項
export interface IPrize {
  name?: string;
  quota?: number;
}

export interface IExtraConditions {
  requiredTagCount: number;
  requiredTextContent: string;
  allowRepeatWinning: boolean;
}

// 完整的抽獎活動設定
export interface ILotteryActivitySettings {
  activityName: string;
  activeTime: ILotteryActivityTime;
  prizes: IPrize[];
  extraConditions: IExtraConditions;
}

export interface ILotteryResult {
  prizeName: string;
  eachPrizeWinners: IInstagramComment[] | [];
  probability: string;
}
export interface IPerformLotteryResult {
  lotteryTime: string;
  activitySettings: ILotteryActivitySettings;
  lotteryResults: ILotteryResult[] | [];
  allWinners:IInstagramComment[] | []
}
