import { FaceBookFanAccount } from '../../utils/facebook/faceBookSdkTypes';

export interface ICommentData {
  id: string;
  text: string;
  username: string;
}

export interface IInstagramStore {
  businessAccount: FaceBookFanAccount | null;
}

export interface IInstagramComment {
  id: string;
  text: string;
  username: string;
}

export interface IInstagramPost {
  media_type: string;
  media_url: string;
  comments?: ICommentData[];
  caption: string;
  timestamp: string;
  id: string;
}

export interface IInstagramMediaApi {
  data: IInstagramPost[];
  paging?: object;
}
