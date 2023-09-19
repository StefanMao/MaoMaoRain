import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FaceBookFanAccount } from '../../utils/facebook/faceBookSdkTypes';
import { IInstagramStore, IInstagramPost, IInstagramComment } from '../../utils/Instagram/instagramInterface';

const initialState: IInstagramStore = {
  selectedBusinessAccount: null,
  selectedPost: null,
  currentPostComments: [],
};

export const instagramSlice = createSlice({
  name: 'instagramSlice',
  initialState,
  reducers: {
    saveSelectBusinessAccount: (state, action: PayloadAction<FaceBookFanAccount | null>) => {
      state.selectedBusinessAccount = action.payload;
    },
    saveSelectedPost:(state, action: PayloadAction<IInstagramPost | null>) => {
      state.selectedPost = action.payload;
    },
    saveCurrentPostComments: (state, action: PayloadAction<IInstagramComment[] | []>) => {
      state.currentPostComments = action.payload;
    }
  },
});

export const { saveSelectBusinessAccount, saveSelectedPost, saveCurrentPostComments } = instagramSlice.actions;

export default instagramSlice.reducer;
