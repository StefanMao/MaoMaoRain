import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FacebookAuthResponse, MeApiResponse } from '../../utils/facebook/faceBookSdkTypes';

interface FbUserDataState extends FacebookAuthResponse, MeApiResponse {}

const initialState: FbUserDataState = {
  accessToken: '',
  userID: '',
  name: '',
  email: '',
  accounts: { data: [] },
};

export const userSlice = createSlice({
  name: 'fbUserData',
  initialState: initialState,
  reducers: {
    saveUserData: (state, action: PayloadAction<FbUserDataState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetUserData: (state) => {
      return {
        ...state,
        ...initialState,
      };
    },
  },
});

export const { saveUserData, resetUserData } = userSlice.actions;

export default userSlice.reducer;
