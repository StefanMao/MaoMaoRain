import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FacebookAuthResponse, MeApiResponse } from '../../utils/facebook/faceBookSdkTypes';

interface FbUserDataState extends FacebookAuthResponse, MeApiResponse {}

const initialState: FbUserDataState = {
  accessToken: '',
  userID: '',
  name: '',
  email: '',
  accounts: {},
};

export const userSlice = createSlice({
  name: 'fbUserData',
  initialState: initialState,
  reducers: {
    saveUserData: (state, action: PayloadAction<FbUserDataState>) => {
      console.log('saveUserData', action.payload);
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { saveUserData } = userSlice.actions;

export default userSlice.reducer;
