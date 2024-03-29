import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';

import { FaceBookFanAccount } from '../../utils/facebook/faceBookSdkTypes';
import {
  IInstagramStore,
  IInstagramPost,
  IInstagramComment,
  ILotteryActivitySettings,
  IPerformLotteryResult,
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
  extraConditions: {
    requiredTagCount: 0,
    requiredTextContent: '',
    allowRepeatWinning: false,
  },
};

const initialState: IInstagramStore = {
  selectedBusinessAccount: null,
  selectedPost: null,
  currentPostComments: [],
  currentLotterySetting: lotterySettingDefault,
  currentQualifiedComments: [],
  currentNonQualifiedComments: [],
  islotterySettingFormError: false,
  isActivitySettingApplied: false,
  performLotteryResult: null,
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
      state.currentLotterySetting.activeTime.startDate = moment(
        state.selectedPost?.timestamp,
      ).format('YYYY-MM-DD');
      state.currentLotterySetting.activeTime.endDate = moment().format('YYYY-MM-DD');
    },
    saveCurrentPostComments: (state, action: PayloadAction<IInstagramComment[] | []>) => {
      state.currentPostComments = action.payload;
    },
    saveCurrentLotterySetting: (state, action: PayloadAction<ILotteryActivitySettings>) => {
      state.currentLotterySetting = action.payload;
    },
    saveCurrentQualifiedComments: (state, action: PayloadAction<IInstagramComment[] | []>) => {
      state.currentQualifiedComments = action.payload;
    },
    saveCurrentNonQualifiedComments: (state, action: PayloadAction<IInstagramComment[] | []>) => {
      state.currentNonQualifiedComments = action.payload;
    },
    updateLotterySettingFormErrorStatus: (state, action: PayloadAction<boolean>) => {
      state.islotterySettingFormError = action.payload;
    },
    initCurrentLotterySetting: (state) => {
      state.currentLotterySetting = {
        ...lotterySettingDefault,
        activeTime: {
          startDate: moment(state.selectedPost?.timestamp).format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD'),
        },
      };
    },
    updateLotterySettingApplyStatus: (state, action: PayloadAction<boolean>) => {
      state.isActivitySettingApplied = action.payload;
    },
    saveLotteryResults: (state, action: PayloadAction<IPerformLotteryResult | null>) => {
      state.performLotteryResult = action.payload;
    },
  },
});

export const {
  saveSelectBusinessAccount,
  saveSelectedPost,
  saveCurrentPostComments,
  saveCurrentLotterySetting,
  saveCurrentQualifiedComments,
  saveCurrentNonQualifiedComments,
  updateLotterySettingFormErrorStatus,
  initCurrentLotterySetting,
  updateLotterySettingApplyStatus,
  saveLotteryResults,
} = instagramSlice.actions;

export default instagramSlice.reducer;
