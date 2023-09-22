import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FaceBookFanAccount } from '../../utils/facebook/faceBookSdkTypes';
import {
  IInstagramStore,
  IInstagramPost,
  IInstagramComment,
  ILotteryActivitySettings,
} from '../../utils/Instagram/instagramInterface';

const lotterySettingDefault = {
  activityName: '',
  activeTime: {
    startDate: '',
    endDate: '',
  },
  prizes: [
    {
      name: '',
      quota: 0,
    },
  ],
};

const initialState: IInstagramStore = {
  selectedBusinessAccount: null,
  selectedPost: null,
  currentPostComments: [],
  currentLotterySetting: lotterySettingDefault,
};

export const instagramSlice = createSlice({
  name: 'instagramSlice',
  initialState,
  reducers: {
    saveSelectBusinessAccount: (state, action: PayloadAction<FaceBookFanAccount | null>) => {
      state.selectedBusinessAccount = action.payload;
    },
    saveSelectedPost: (state, action: PayloadAction<IInstagramPost | null>) => {
      state.selectedPost = action.payload;
    },
    saveCurrentPostComments: (state, action: PayloadAction<IInstagramComment[] | []>) => {
      state.currentPostComments = action.payload;
    },
    saveCurrentLotterySetting: (state, action: PayloadAction<ILotteryActivitySettings>) => {
      state.currentLotterySetting = action.payload;
    },
  },
});

export const {
  saveSelectBusinessAccount,
  saveSelectedPost,
  saveCurrentPostComments,
  saveCurrentLotterySetting,
} = instagramSlice.actions;

export default instagramSlice.reducer;
