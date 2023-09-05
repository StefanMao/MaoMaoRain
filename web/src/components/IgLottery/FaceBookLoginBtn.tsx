import React from 'react';
import { FacebookSDK } from '../../utils/faceBookSdk';
import Cookies from 'js-cookie';

import Button from '@mui/material/Button';
import FacebookOutlineIcon from '@mui/icons-material/FacebookOutlined';

// interface FaceBookUserData {
//   accessToken: string;
// }
interface FaceBookActions {
  handleFbLoginClick: () => void;
  setFaceBookCookies: (accessToken: string) => void;
}

export const useHook = (): [FaceBookActions] => {
  const handleFbLoginClick = async () => {
    try {
      const fbSdkInstance = await FacebookSDK.getInstance();
      await fbSdkInstance.login();
      const response = await fbSdkInstance.getLoginStatus();
      if (response.authResponse) {
        setFaceBookCookies(response.authResponse.accessToken);
        const me = await fbSdkInstance.me();
        console.log(me);
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
