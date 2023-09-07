import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';

import Button from '@mui/material/Button';
import FacebookOutlineIcon from '@mui/icons-material/FacebookOutlined';

import { saveUserData } from '../../store/faceBookLogin/userDataSlice';
import { selectUserData } from '../../store/faceBookLogin/selectors';
import { FacebookLoginStatus, MeApiResponse } from '../../utils/facebook/faceBookSdkTypes';
import { FacebookSDK } from '../../utils/facebook/faceBookSdk';

interface FaceBookActions {
  handleFbLoginClick: () => void;
  setFaceBookCookies: (accessToken: string) => void;
}

export const useHook = (): [FaceBookActions] => {
  const dispatch = useDispatch();
  const userData = useSelector(selectUserData);
  console.log('useSelector', userData);

  const handleFbLoginClick = async () => {
    try {
      const fbSdkInstance = await FacebookSDK.getInstance();
      await fbSdkInstance.login();
      const response: FacebookLoginStatus = await fbSdkInstance.getLoginStatus();
      if (response.authResponse) {
        const { accessToken, userID } = response.authResponse;
        setFaceBookCookies(accessToken);
        const me: MeApiResponse = await fbSdkInstance.me();
        const { name, email, accounts } = me;
        const userData = {
          accessToken,
          userID,
          name,
          email,
          accounts,
        };
        dispatch(saveUserData(userData));
      }
      console.log('Facebook Login Status:', response);
    } catch (error) {
      console.error('Facebook Login Error:', error);
    }
  };

  const setFaceBookCookies = (accessToken: string): void => {
    Cookies.set('FacebookAccessToken', accessToken);
  };

  const actions: FaceBookActions = { handleFbLoginClick, setFaceBookCookies };

  return [actions];
};

const FaceBookLoginBtn: React.FC = () => {
  const [actions] = useHook();

  return (
    <Button
      startIcon={<FacebookOutlineIcon />}
      variant='contained'
      onClick={actions.handleFbLoginClick}
    >
      使用 FaceBook 帳號登入
    </Button>
  );
};
export default FaceBookLoginBtn;
