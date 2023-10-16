import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';

import {
  Container,
  Typography,
  Alert,
  AlertTitle,
  Box,
  Divider,
  Stack,
  Grid,
  Button,
  Chip,
} from '@mui/material';

import InfoIcon from '@mui/icons-material/Info';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import LinkIcon from '@mui/icons-material/Link';
import LogoutIcon from '@mui/icons-material/Logout';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import AnalyticsIcon from '@mui/icons-material/Analytics';

import FaceBookLoginBtn from '../../components/ig-lottery/FaceBookLoginBtn';
import FaceBookUserInfo from '../../components/ig-lottery/FaceBookUserInfo';
import IgAccountContent from '../../components/ig-lottery/IgAccountContent';
import IgAccountVerifyBtn from '../../components/ig-lottery/IgAccountVerifyBtn';
import IgPostSelectComponent from '../../components/ig-lottery/IgPostSelectComponent';
import IgLotterySettingContainer from '../../components/ig-lottery/IgLotterySettingContainer/IgLotterySettingContainer';
import IgPostCommentTabs from '../../components/ig-lottery/IgPostCommentTabs/IgPostCommentTabs';
import IgPostCommentTable from '../../components/ig-lottery/IgPostCommentTable/IgPostCommentTable';

import { saveUserData, resetUserData } from '../../store/faceBookLogin/userDataSlice';
import { instagramData } from '../../store/InstagramStore/selectors';
import {
  FacebookAuthResponse,
  MeApiResponse,
  FacebookLoginStatus,
} from '../../utils/facebook/faceBookSdkTypes';
import {
  IPerformLotteryResult,
  ILotteryActivitySettings,
} from '../../utils/Instagram/instagramInterface';
import { selectUserData } from '../../store/faceBookLogin/selectors';
import { FacebookSDK } from '../../utils/facebook/faceBookSdk';

interface UserDataActions {
  saveLoggedInDataToStore: () => Promise<void>;
  facebookLogoutBtnClick: () => Promise<void>;
  clearUserData: () => void;
}

interface UserDataState extends FacebookAuthResponse, MeApiResponse {}

interface IgLotteryPageActions extends UserDataActions {
  renderFacebookStatusIcon: (isEmpty: boolean) => React.ReactNode;
}
interface IgLotteryPageStates {
  userFbLoggInData: UserDataState;
  isUserIgAccountsDataEmpty: boolean;
  isFacebookLoggedIn: boolean;
  isFacebookUserDataEmpty: boolean;
  isSelectedPostDateEmpty: boolean;
  performLotteryResult: IPerformLotteryResult | null;
  currentLotterySetting: ILotteryActivitySettings;
}

export const useHook = (): [IgLotteryPageStates, IgLotteryPageActions] => {
  const dispatch = useDispatch();
  const userFbLoggInData: UserDataState = useSelector(selectUserData);
  const { selectedPost, performLotteryResult, currentLotterySetting } = useSelector(instagramData);
  const isUserIgAccountsDataEmpty: boolean =
    !userFbLoggInData?.accounts || userFbLoggInData?.accounts.data.length === 0;

  const isFacebookLoggedIn: boolean = !!Cookies.get('FacebookAccessToken');

  const isFacebookUserDataEmpty: boolean = userFbLoggInData.userID === '';

  const isSelectedPostDateEmpty: boolean = selectedPost?.timestamp === '';

  const renderFacebookStatusIcon = (isEmpty: boolean) => {
    return isEmpty ? <LinkOffIcon sx={{ color: 'red' }} /> : <LinkIcon sx={{ color: 'green' }} />;
  };

  const saveLoggedInDataToStore = async (): Promise<void> => {
    if (isFacebookLoggedIn && userFbLoggInData.accessToken === '') {
      try {
        const fbSdkInstance = await FacebookSDK.getInstance();
        const response: FacebookLoginStatus = await fbSdkInstance.getLoginStatus();
        if (response.authResponse) {
          const { accessToken, userID } = response.authResponse;
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
        // console.log('Facebook Login Refresh Status:', response);
      } catch (error) {
        console.error('Facebook Login Refresh Error:', error);
      }
    }
  };

  const facebookLogoutBtnClick = async (): Promise<void> => {
    const fbSdkInstance = await FacebookSDK.getInstance();
    await fbSdkInstance.logout();
    clearUserData();
  };

  const clearUserData = (): void => {
    Cookies.remove('FacebookAccessToken');
    dispatch(resetUserData());
  };

  React.useEffect(() => {
    saveLoggedInDataToStore();
  }, []);

  const states: IgLotteryPageStates = {
    userFbLoggInData,
    isUserIgAccountsDataEmpty,
    isFacebookLoggedIn,
    isFacebookUserDataEmpty,
    isSelectedPostDateEmpty,
    performLotteryResult,
    currentLotterySetting,
  };
  const actions: IgLotteryPageActions = {
    saveLoggedInDataToStore,
    facebookLogoutBtnClick,
    clearUserData,
    renderFacebookStatusIcon,
  };

  return [states, actions];
};

const IgLotteryPage: React.FC = () => {
  const [states, actions] = useHook();
  const {
    userFbLoggInData,
    isFacebookUserDataEmpty,
    isUserIgAccountsDataEmpty,
    isSelectedPostDateEmpty,
    performLotteryResult,
    currentLotterySetting,
  } = states;
  const { facebookLogoutBtnClick, renderFacebookStatusIcon } = actions;

  return (
    <Container>
      <h1>Instagram抽獎工具</h1>
      <Alert severity='info' sx={{ textAlign: 'left' }}>
        <AlertTitle>關於Ig抽獎小工具:</AlertTitle>
        歡迎使用Social Pluse Hub
        Instagram抽獎工具，我們能幫助您輕鬆讀取IG貼文留言，然後由系統隨機選出幸運得獎者。在使用之前，只需將您的Facebook粉絲專頁連結至您的Instagram帳號，並給予本平台應用程式權限即可。
      </Alert>
      <Alert severity='warning' sx={{ textAlign: 'left', marginTop: '8px', marginBottom: '8px' }}>
        <AlertTitle>網站使用條款:</AlertTitle>
        使用我們的服務代表您接受我們的隱私政策和Instagram使用條款。如果您不同意，請停止使用服務。
      </Alert>
      <Divider sx={{ margin: '16px 0px 16px 0px' }} />
      <Grid>
        <Stack
          direction={{ sm: 'column', md: 'row' }}
          alignItems='center'
          sx={{ margin: '12px 0px 12px 0px' }}
          spacing={2}
        >
          {renderFacebookStatusIcon(isFacebookUserDataEmpty)}
          <Typography variant='h5' sx={{ textAlign: 'left' }}>
            FaceBook帳號
          </Typography>
          {isFacebookUserDataEmpty ? (
            <Typography variant='body2' sx={{ textAlign: 'left' }}>
              您尚未連結任何FaceBook帳號資訊，請點擊按鈕進行帳號綁定。
            </Typography>
          ) : (
            <Grid>
              <Typography variant='body2' sx={{ textAlign: 'left' }}>
                您已經成功連結Facebook帳號，若要移除連結，請點擊登出按鈕
                <Button
                  variant='outlined'
                  startIcon={<LogoutIcon />}
                  sx={{ marginLeft: '8px' }}
                  onClick={() => facebookLogoutBtnClick()}
                >
                  帳號登出
                </Button>
              </Typography>
            </Grid>
          )}
        </Stack>
        {isFacebookUserDataEmpty ? (
          <Stack alignItems='center'>
            <FaceBookLoginBtn />
          </Stack>
        ) : (
          <Stack>
            <FaceBookUserInfo userData={userFbLoggInData} />
          </Stack>
        )}
      </Grid>
      {!isFacebookUserDataEmpty && (
        <Box mt={4}>
          <Stack direction='row' justifyContent='start' alignItems='center' spacing={2}>
            {renderFacebookStatusIcon(userFbLoggInData?.accounts?.data.length === 0)}
            <Typography variant='h5'>Instagram 帳號設定</Typography>
            {isUserIgAccountsDataEmpty && (
              <Chip
                variant='outlined'
                color='error'
                icon={<InfoIcon />}
                label='未取得任何一個Ig粉絲專頁授權，請點擊「編輯權限」按鈕確認授權。'
                sx={{ marginLeft: '4px' }}
                size='small'
              />
            )}
            <IgAccountVerifyBtn />
          </Stack>
          {!isUserIgAccountsDataEmpty && <IgAccountContent accounts={userFbLoggInData.accounts} />}
        </Box>
      )}
      {!isUserIgAccountsDataEmpty && !isSelectedPostDateEmpty && (
        <Box mt={4}>
          <Stack direction='row' justifyContent='start' alignItems='center' spacing={2} mb={1}>
            <PhotoLibraryIcon color='primary' />
            <Typography variant='h5' sx={{ textAlign: 'left' }}>
              Instagram 貼文選擇
            </Typography>
          </Stack>
          <IgPostSelectComponent />
        </Box>
      )}
      {!isUserIgAccountsDataEmpty && (
        <Box mt={4}>
          <Stack direction='row' justifyContent='start' alignItems='center' spacing={2} mb={1}>
            <PhotoLibraryIcon color='primary' />
            <Typography variant='h5' sx={{ textAlign: 'left' }}>
              抽獎活動設定
            </Typography>
          </Stack>
          <IgLotterySettingContainer />
        </Box>
      )}
      {!isUserIgAccountsDataEmpty && performLotteryResult && (
        <Box mt={4} justifyContent='start'>
          <Stack direction='row' justifyContent='start' alignItems='center' spacing={2} mb={1}>
            <AnalyticsIcon color='primary' />
            <Typography variant='h5' sx={{ textAlign: 'left' }}>
              中獎名單
            </Typography>
          </Stack>
          <Typography variant='h6' sx={{ textAlign: 'left' }}>
            {`抽獎活動名稱: ${currentLotterySetting.activityName}`}
          </Typography>
          <Stack spacing={2} direction='row' justifyContent='start' alignItems='center' mb={1}>
            <Typography
              variant='subtitle2'
              sx={{ textAlign: 'left', color: '#FF4545', fontWeight: 'bold' }}
            >
              此中獎名單由 Social Pluse Hub 系統自動產生，恭喜以下中獎者。
            </Typography>

            <Button variant='outlined' disabled>
              詳細資訊
            </Button>
          </Stack>
          <IgPostCommentTable commentData={performLotteryResult?.allWinners} />
        </Box>
      )}
      {!isUserIgAccountsDataEmpty && (
        <Box mt={4}>
          <Stack direction='row' justifyContent='start' alignItems='center' spacing={2} mb={1}>
            <AnalyticsIcon color='primary' />
            <Typography variant='h5' sx={{ textAlign: 'left' }}>
              抽獎活動名單
            </Typography>
          </Stack>
          <IgPostCommentTabs />
        </Box>
      )}
    </Container>
  );
};

export default IgLotteryPage;
