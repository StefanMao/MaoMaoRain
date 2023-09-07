import React from 'react';

import { Container, Typography, Alert, AlertTitle, Box } from '@mui/material';

// import { FacebookSDK } from '../../utils/faceBookSdk';
import FaceBookLoginBtn from '../../components/ig-lottery/FaceBookLoginBtn';

// export const useHook = () => {
// };

const IgLotteryPage: React.FC = () => {
  // const [actions] = useHook();
  return (
    <Container>
      <h1>Instagram抽獎工具</h1>
      <Alert severity='info' sx={{ textAlign: 'left' }}>
        <AlertTitle>關於Ig抽獎小工具:</AlertTitle>
        歡迎使用Instagram抽獎工具，可以輕鬆讀取IG貼文留言，然後由系統隨機選出幸運得獎者。在使用之前，只需將您的Facebook粉絲專頁新增至您的Instagram帳號即可。
      </Alert>
      <Alert severity='warning' sx={{ textAlign: 'left', marginTop: '8px', marginBottom: '8px' }}>
        <AlertTitle>網站使用條款:</AlertTitle>
        使用我們的服務代表您接受我們的隱私政策和Instagram使用條款。如果您不同意，請停止使用服務。更改設置請點擊「編輯」。
      </Alert>
      <Box>
        <Typography variant='h5' sx={{ textAlign: 'left' }}>
          Instagram 帳號權限設定
        </Typography>
        <FaceBookLoginBtn />
      </Box>
      {/* <FaceBookLoginBtn onClick={logoutBtnClick} />
      <FaceBookLoginBtn onClick={me} /> */}
    </Container>
  );
};

// const logoutBtnClick = async () => {
//   const fbSdkInstance = await FacebookSDK.getInstance();
//   await fbSdkInstance.logout();
// };

export default IgLotteryPage;
