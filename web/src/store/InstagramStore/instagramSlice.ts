import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FaceBookFanAccount } from '../../utils/facebook/faceBookSdkTypes';
import { IInstagramStore } from '../../utils/Instagram/instagramInterface';

const initialState: IInstagramStore = {
  businessAccount: null,
};

export const instagramSlice = createSlice({
  name: 'instagramSlice',
  initialState,
  reducers: {
    saveSelectBusinessAccount: (state, action: PayloadAction<FaceBookFanAccount | null>) => {
      state.businessAccount = action.payload;
    },
  },
});

export const { saveSelectBusinessAccount } = instagramSlice.actions;

export default instagramSlice.reducer;
