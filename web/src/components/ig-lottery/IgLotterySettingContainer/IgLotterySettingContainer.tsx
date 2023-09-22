import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import {
  TextField,
  Typography,
  FormControl,
  // FormGroup,
  // FormControlLabel,
  // Checkbox,
  // Box,
  Paper,
  Grid,
  InputAdornment,
  CardActions,
  Button,
  // FormHelperText,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import RefreshIcon from '@mui/icons-material/Refresh';

import ApplySettingsButton from '../../ig-lottery/ApplySettingsButton/ApplySettingsButton';
import {
  ILotteryActivitySettings,
  IPrize,
  ILotteryActivityTime,
} from '../../../utils/Instagram/instagramInterface';
import { instagramData } from '../../../store/InstagramStore/selectors';
import { saveCurrentLotterySetting } from '../../../store/InstagramStore/instagramSlice';
import { FieldError } from '../../../utils/common/fieldErrorTypeInterface';

interface IgLotterySettingContainerStates {
  currentLotterySetting: ILotteryActivitySettings;
  activityNameFieldErrorStatus: FieldError;
  prizeNameFieldErrorStatus: FieldError;
  prizeQuotaFieldErrorStatus: FieldError;
}

interface IgLotterySettingContainerActions {
  handleActivityNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePrizeNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePrizeQuotaChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearFieldsBtnClick: () => void;
}

const initialFieldError: FieldError = {
  isError: false,
};

export const useHook = (): [IgLotterySettingContainerStates, IgLotterySettingContainerActions] => {
  const dispatch = useDispatch();
  const { currentLotterySetting, selectedPost } = useSelector(instagramData);
  const [activityNameFieldErrorStatus, setActivityNameFieldErrorStatus] =
    useState<FieldError>(initialFieldError);
  const [prizeNameFieldErrorStatus, setPrizeNameFieldErrorStatus] =
    useState<FieldError>(initialFieldError);
  const [prizeQuotaFieldErrorStatus, setPrizeQuotaFieldErrorStatus] =
    useState<FieldError>(initialFieldError);

  const handleClearFieldsBtnClick = (): void => {
    updateLotterySettingToStore(currentLotterySetting, '', undefined, { name: '', quota: 0 });
  };

  const updateLotterySettingToStore = (
    currentSettings: ILotteryActivitySettings,
    activityName?: string,
    activeTime?: ILotteryActivityTime,
    prize?: IPrize,
  ): void => {
    const updatedSettings = { ...currentSettings };

    if (activityName !== undefined) {
      updatedSettings.activityName = activityName;
    }

    if (activeTime !== undefined) {
      updatedSettings.activeTime = { ...activeTime };
    }
    console.log('updateLotterySettingToStore', prize);

    if (prize !== undefined) {
      updatedSettings.prizes = [{ ...prize }];
    }

    dispatch(saveCurrentLotterySetting(updatedSettings));
  };

  const handlePrizeNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const prizeName = event.target.value.trim();
    const errorStatus: FieldError = {
      isError: prizeName === '' || prizeName.length > 50,
      errorText: prizeName === '' ? '獎項名稱不能為空!' : '獎品名稱不能超過 50 字!',
    };

    setPrizeNameFieldErrorStatus(errorStatus);
    updateLotterySettingToStore(currentLotterySetting, undefined, undefined, {
      name: prizeName,
    });
  };

  const handlePrizeQuotaChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const prizeQuota = event.target.value;
    const parsedQuota = parseInt(prizeQuota);
    const isInvalid = prizeQuota === '' || isNaN(parsedQuota) || parsedQuota < 1;
    const errorStatus: FieldError = {
      isError: isInvalid,
      errorText: isInvalid ? '名額數量必須為整數、且不小於1' : '',
    };

    const quota = isInvalid ? 0 : parsedQuota;

    setPrizeQuotaFieldErrorStatus(errorStatus);
    updateLotterySettingToStore(currentLotterySetting, undefined, undefined, {
      quota,
    });
  };

  const handleActivityNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const activityName = event.target.value.trim();

    // 更新欄位錯誤資訊
    const errorStatus: FieldError = {
      isError: activityName === '' || activityName.length > 50,
      errorText: activityName === '' ? '活動名稱不能為空!' : '活動名稱不能超過 50 字!',
    };

    setActivityNameFieldErrorStatus(errorStatus);
    updateLotterySettingToStore(currentLotterySetting, activityName, undefined, undefined);
  };

  const saveActiveTime = (startDate: string, endDate: string): void => {
    const settingData = {
      ...currentLotterySetting,
      activeTime: {
        startDate,
        endDate,
      },
    };
    dispatch(saveCurrentLotterySetting(settingData));
  };

  const initActiveTime = (): void => {
    if (!selectedPost) return;

    const startDate = moment(selectedPost.timestamp).format('YYYY-MM-DD');
    const endDate = moment().format('YYYY-MM-DD');

    saveActiveTime(startDate, endDate);
  };

  React.useEffect(() => {
    initActiveTime();
  }, [selectedPost]);

  const states: IgLotterySettingContainerStates = {
    currentLotterySetting,
    activityNameFieldErrorStatus,
    prizeNameFieldErrorStatus,
    prizeQuotaFieldErrorStatus,
  };

  const actions: IgLotterySettingContainerActions = {
    handleActivityNameChange,
    handlePrizeNameChange,
    handlePrizeQuotaChange,
    handleClearFieldsBtnClick,
  };
  return [states, actions];
};

const IgLotterySettingContainer: React.FC = () => {
  const [states, actions] = useHook();
  const {
    currentLotterySetting,
    activityNameFieldErrorStatus,
    prizeNameFieldErrorStatus,
    prizeQuotaFieldErrorStatus,
  } = states;
  const {
    handleActivityNameChange,
    handlePrizeNameChange,
    handlePrizeQuotaChange,
    handleClearFieldsBtnClick,
  } = actions;
  console.log('currentLotterySetting', currentLotterySetting);

  return (
    <Paper elevation={2} sx={{ padding: '12px' }}>
      <Grid container justifyContent='space-between'>
        <Typography variant='h5' align='left'>
          抽獎活動名稱
        </Typography>
        <Button
          variant='contained'
          size='small'
          startIcon={<RefreshIcon />}
          onClick={handleClearFieldsBtnClick}
        >
          重置設定
        </Button>
      </Grid>
      <FormControl fullWidth>
        <TextField
          label='活動名稱'
          variant='outlined'
          margin='normal'
          value={currentLotterySetting.activityName}
          onChange={handleActivityNameChange}
          error={activityNameFieldErrorStatus.isError}
          helperText={
            activityNameFieldErrorStatus.isError && activityNameFieldErrorStatus.errorText
          }
        />
      </FormControl>
      <FormControl fullWidth sx={{ marginTop: '12px' }}>
        <Typography variant='h5' align='left'>
          抽獎活動時間
        </Typography>
        <Grid
          container
          alignItems='center'
          mt={1}
          sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
          spacing={1}
        >
          <Grid item container alignItems='flex-start' sm={6} direction='column'>
            <Typography mr={1} variant='subtitle1' align='left'>
              活動開始日期:
            </Typography>
            <DatePicker
              readOnly
              sx={{ height: '60px', width: '100%' }}
              value={moment(currentLotterySetting.activeTime.startDate)}
              maxDate={moment(currentLotterySetting.activeTime.endDate)}
              format='YYYY-MM-DD'
            />
          </Grid>
          <Grid item container alignItems='flex-start' sm={6} direction='column'>
            <Typography mr={1} variant='subtitle1' align='left'>
              活動截止日期:
            </Typography>
            <DatePicker
              sx={{ height: '60px', width: '100%' }}
              value={moment(currentLotterySetting.activeTime.endDate)}
              minDate={moment(currentLotterySetting.activeTime.startDate)}
              format='YYYY-MM-DD'
            />
          </Grid>
        </Grid>
      </FormControl>
      {/* <FormControl fullWidth sx={{ marginTop: '12px' }}>
        <Typography variant='h5' align='left'>
          其他條件設定
        </Typography>
        <Grid
          container
          alignItems='center'
          mt={1}
          sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
        >
          <FormGroup>
            <FormControlLabel
              control={<Checkbox color='primary' />}
              label='可重複中獎'
              sx={{ alignItems: 'center' }}
            />
          </FormGroup>
        </Grid>
      </FormControl> */}
      <FormControl fullWidth sx={{ flexDirection: 'row', marginTop: '8px' }}>
        <Grid container alignItems='center' mt={1} direction='row' spacing={2}>
          <Grid item container alignItems='center' direction='row' xs={8}>
            <Typography mr={1} variant='subtitle2' align='left'>
              獎項 1:
            </Typography>
            <TextField
              sx={{ height: '60px', flex: 1 }}
              label='請輸入獎項'
              variant='outlined'
              margin='normal'
              value={currentLotterySetting?.prizes[0]?.name || ''}
              onChange={handlePrizeNameChange}
              error={prizeNameFieldErrorStatus.isError}
              helperText={prizeNameFieldErrorStatus.isError && prizeNameFieldErrorStatus.errorText}
            />
          </Grid>
          <Grid item container alignItems='center' direction='row' xs={4}>
            <Typography mr={1} variant='subtitle2' align='left'>
              名額:
            </Typography>
            <TextField
              sx={{ height: '60px', flex: 1 }}
              InputProps={{
                endAdornment: <InputAdornment position='end'>位</InputAdornment>,
                inputProps: { min: 1 },
              }}
              variant='outlined'
              value={currentLotterySetting?.prizes[0]?.quota || '0'}
              onChange={handlePrizeQuotaChange}
              error={prizeQuotaFieldErrorStatus.isError}
              helperText={
                prizeQuotaFieldErrorStatus.isError && prizeQuotaFieldErrorStatus.errorText
              }
              margin='normal'
            />
          </Grid>
        </Grid>
      </FormControl>
      <CardActions sx={{ flexDirection: { xs: 'column', sm: 'row' }, marginTop: '8px' }}>
        <ApplySettingsButton />
      </CardActions>
    </Paper>
  );
};

export default IgLotterySettingContainer;
