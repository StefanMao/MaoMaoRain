import { FaceBookFanAccount } from '../../utils/facebook/faceBookSdkTypes';

export interface IIgUser {
  id: string;
  username: string;
}
export interface ICommentData {
  id: string;
  text: string;
  username: string;
  timestamp: string;
  like_count: number;
  from: IIgUser;
}

export interface IInstagramStore {
  selectedBusinessAccount: FaceBookFanAccount | null;
  selectedPost: IInstagramPost | null;
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
  shortcode: string;
}

export interface IInstagramMediaApi {
  data: IInstagramPost[];
  paging?: object;
}
