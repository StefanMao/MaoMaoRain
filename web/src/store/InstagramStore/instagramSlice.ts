import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FaceBookFanAccount } from '../../utils/facebook/faceBookSdkTypes';
import { IInstagramStore, IInstagramPost } from '../../utils/Instagram/instagramInterface';

const initialState: IInstagramStore = {
  selectedBusinessAccount: null,
  selectedPost: null,
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
    }
  },
});

export const { saveSelectBusinessAccount, saveSelectedPost } = instagramSlice.actions;

export default instagramSlice.reducer;
