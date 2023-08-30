import React from 'react';
import { FacebookSDK } from '../../utils/faceBookSdk';
import FaceBookLoginBtn from '../../components/IgLottery/FaceBookLoginBtn';

const IgLotteryPage: React.FC = () => {
  return (
    <div>
      <h1>抽奖页面</h1>
      <p>抽獎測試按鈕</p>
      <FaceBookLoginBtn onClick={faceBookLoginBtnClick} />
      <FaceBookLoginBtn onClick={logoutBtnClick} />
      <FaceBookLoginBtn onClick={me} />
    </div>
  );
};

const faceBookLoginBtnClick = async () => {
  const fbSdkInstance = await FacebookSDK.getInstance();
  await fbSdkInstance.login();
  const loginStatus = await fbSdkInstance.getLoginStatus();
  console.log('Facebook Login Status:', loginStatus);
};

const logoutBtnClick = async () => {
  const fbSdkInstance = await FacebookSDK.getInstance();
  await fbSdkInstance.logout();
};

const me = async () => {
  const fbSdkInstance = await FacebookSDK.getInstance();
  const me = await fbSdkInstance.me();
  console.log(me);
};

export default IgLotteryPage;
