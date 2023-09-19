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

export interface IInstagramStore {
  selectedBusinessAccount: FaceBookFanAccount | null;
  selectedPost: IInstagramPost | null;
  currentPostComments: IInstagramComment[] | [];
}

export interface IInstagramPost {
  media_type: string;
  media_url: string;
  comments?: IInstagramComment[];
  caption: string;
  timestamp: string;
  id: string;
  shortcode: string;
}

export interface IInstagramMediaApi {
  data: IInstagramPost[];
  paging?: object;
}
