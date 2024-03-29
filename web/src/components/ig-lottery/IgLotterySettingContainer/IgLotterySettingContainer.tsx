import React, { useState } from 'react';
import { useForm, Controller, Control, FieldErrors } from 'react-hook-form';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';

import {
  TextField,
  Typography,
  FormControl,
  Paper,
  Grid,
  InputAdornment,
  CardActions,
  Button,
  Checkbox,
} from '@mui/material';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';

import { ApplySettingsBtnStyle, LotteryDrawBtnStyle } from './IgLotterySettingContainerStyle';
import CustomSnackbar from '../../commonUI/customSnackbar/customSnackbar';
import {
  ILotteryActivitySettings,
  IInstagramPost,
  IInstagramComment,
  ILotteryResult,
  IPerformLotteryResult,
} from '../../../utils/Instagram/instagramInterface';

import { instagramData } from '../../../store/InstagramStore/selectors';
import {
  saveCurrentLotterySetting,
  updateLotterySettingFormErrorStatus,
  initCurrentLotterySetting,
  updateLotterySettingApplyStatus,
  saveLotteryResults,
} from '../../../store/InstagramStore/instagramSlice';

interface IgLotterySettingContainerStates {
  currentLotterySetting: ILotteryActivitySettings;
  control: Control;
  selectedPost: IInstagramPost | null;
  errors: FieldErrors<ILotteryActivitySettings>;
  snackbarOpen: boolean;
  isActivitySettingApplied: boolean;
}

interface IgLotterySettingContainerActions {
  handleClearFieldsBtnClick: () => void;
  handleApplyBtnClick: () => void;
  handleLotteryDrawBtnClick: () => void;
  handleSnackbarOnClose: () => void;
  getValues: (field: string) => Record<string, any>;
}
const snackBarMessage = {
  applySetting: '已套用抽獎活動設定，請至抽獎活動名單查看結果。',
};

export const useHook = (): [IgLotterySettingContainerStates, IgLotterySettingContainerActions] => {
  const dispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const {
    currentLotterySetting,
    selectedPost,
    isActivitySettingApplied,
    currentQualifiedComments,
  } = useSelector(instagramData);

  const {
    control,
    getValues,
    formState: { errors, isDirty },
    handleSubmit,
    reset,
  } = useForm({ mode: 'onChange' });

  const handleLotteryDrawBtnClick = (): void => {
    const lotteryResults = performLottery(currentLotterySetting, currentQualifiedComments);
    dispatch(saveLotteryResults(lotteryResults));
  };

  const performLottery = (
    activitySettings: ILotteryActivitySettings,
    qualifiedComments: IInstagramComment[],
  ): IPerformLotteryResult => {
    const { prizes } = activitySettings;
    const lotteryResults: ILotteryResult[] = [];
    const copyQualifiedComments = [...qualifiedComments];
    const lotteryTime = moment().format('YYYY-MM-DD hh:mm:ss');
    const allWinners: IInstagramComment[] = [];

    prizes.forEach((prize) => {
      const { name, quota } = prize;

      if (!quota || !name) return [];

      const eachPrizeWinners = [];

      // 如果超過100% 則以100%計算
      const prizeProbability = Math.min((quota / qualifiedComments.length) * 100, 100);

      for (let i = 0; i < quota; i++) {
        if (copyQualifiedComments.length === 0) continue;

        // 避免 獎項名額 數量大於 留言數量
        const randomIndex = Math.floor(Math.random() * copyQualifiedComments.length);
        const winner = copyQualifiedComments.splice(randomIndex, 1);
        eachPrizeWinners.push(winner[0]);
        allWinners.push(winner[0]);
      }

      lotteryResults.push({
        prizeName: name,
        eachPrizeWinners,
        probability: prizeProbability.toFixed(2) + '%',
      });
    });

    return {
      lotteryTime,
      activitySettings,
      lotteryResults,
      allWinners,
    };
  };

  const handleClearFieldsBtnClick = (): void => {
    dispatch(updateLotterySettingFormErrorStatus(false));
    dispatch(initCurrentLotterySetting());
    dispatch(updateLotterySettingApplyStatus(false));
  };

  const resetFrom = (): void => {
    if (currentLotterySetting.activityName === '') {
      reset(currentLotterySetting);
    }
  };

  const handleApplyBtnClick = handleSubmit((data) => {
    dispatch(saveCurrentLotterySetting(data as ILotteryActivitySettings));
    setSnackbarOpen(true);
    dispatch(updateLotterySettingApplyStatus(true));
    reset(currentLotterySetting, { keepValues: true });
  });

  const setFormDefaultValues = (): void => {
    dispatch(initCurrentLotterySetting());
    dispatch(updateLotterySettingApplyStatus(false));
    dispatch(saveLotteryResults(null));
  };

  /**
   * update lottery Setting form error status
   * @param errors
   * 檢查活動設定區塊表單的欄位是否有錯誤情況，記錄到Redux Store
   */
  const updateSettingFormErrorStatus = (errors: FieldErrors<ILotteryActivitySettings>): void => {
    if (Object.keys(errors).length !== 0) {
      dispatch(updateLotterySettingFormErrorStatus(true));
    } else {
      dispatch(updateLotterySettingFormErrorStatus(false));
    }
  };

  const handleSnackbarOnClose = (): void => {
    setSnackbarOpen(false);
  };

  React.useEffect(() => {
    setFormDefaultValues();
  }, [selectedPost]);

  React.useEffect(() => {
    updateSettingFormErrorStatus(errors);
  }, [errors]);

  React.useEffect(() => {
    // 確認 currentLotterySetting 清空之後，在執行reset Form
    resetFrom();
  }, [currentLotterySetting]);

  React.useEffect(() => {
    // 套用設定後，使用者修改欄位，需要重新套用設定
    if (isDirty && isActivitySettingApplied) {
      dispatch(updateLotterySettingApplyStatus(false));
      // 中獎名單清空
      dispatch(saveLotteryResults(null));
    }
  }, [isDirty]);

  const states: IgLotterySettingContainerStates = {
    currentLotterySetting,
    control,
    selectedPost,
    errors,
    snackbarOpen,
    isActivitySettingApplied,
  };

  const actions: IgLotterySettingContainerActions = {
    handleClearFieldsBtnClick,
    getValues,
    handleApplyBtnClick,
    handleSnackbarOnClose,
    handleLotteryDrawBtnClick,
  };
  return [states, actions];
};

const IgLotterySettingContainer: React.FC = () => {
  const [states, actions] = useHook();
  const { control, errors, snackbarOpen, isActivitySettingApplied } = states;
  const {
    handleClearFieldsBtnClick,
    getValues,
    handleApplyBtnClick,
    handleSnackbarOnClose,
    handleLotteryDrawBtnClick,
  } = actions;

  return (
    <Paper elevation={2} sx={{ padding: '12px' }}>
      <form>
        <Grid container justifyContent='space-between'>
          <Typography variant='h5' align='left'>
            抽獎活動名稱
          </Typography>
          <Button
            variant='outlined'
            size='small'
            startIcon={<RefreshIcon />}
            onClick={handleClearFieldsBtnClick}
          >
            重置設定
          </Button>
        </Grid>
        <FormControl fullWidth>
          <Controller
            name='activityName'
            control={control}
            rules={{
              required: '活動名稱不能為空!',
              maxLength: { value: 50, message: '活動名稱不能超過 50 字!' },
            }}
            render={({ field }) => (
              <TextField
                label='活動名稱'
                variant='outlined'
                margin='normal'
                {...field}
                value={field.value || ''}
                error={!!errors.activityName}
                helperText={errors.activityName?.message}
              />
            )}
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
              <Controller
                name={`activeTime.startDate`}
                control={control}
                rules={{
                  required: '活動開始日期不能為空!',
                }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    readOnly
                    sx={{ height: '60px', width: '100%' }}
                    value={moment(field.value) || ''}
                    maxDate={moment(getValues('activeTime.endDate'))}
                    format='YYYY-MM-DD'
                  />
                )}
              />
            </Grid>
            <Grid item container alignItems='flex-start' sm={6} direction='column'>
              <Typography mr={1} variant='subtitle1' align='left'>
                活動截止日期:
              </Typography>
              <Controller
                name={`activeTime.endDate`}
                control={control}
                rules={{
                  required: '活動截止日期不能為空!',
                }}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    sx={{ height: '60px', width: '100%' }}
                    value={moment(field.value) || moment()}
                    minDate={moment(getValues('activeTime.startDate'))}
                    format='YYYY-MM-DD HH:mm:ss'
                  />
                )}
              />
            </Grid>
          </Grid>
        </FormControl>
        <FormControl fullWidth sx={{ flexDirection: 'row', marginTop: '8px' }}>
          <Grid container alignItems='center' direction='row' spacing={2}>
            <Grid item container alignItems='center' direction='row' xs={8}>
              <Typography mr={1} variant='subtitle2' align='left'>
                獎項 1:
              </Typography>
              <Controller
                name={`prizes[0].name`}
                control={control}
                rules={{
                  required: '獎項名稱不能為空!',
                  maxLength: { value: 50, message: '獎項名稱不能超過 50 字!' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ height: '60px', flex: 1 }}
                    label='請輸入獎項'
                    variant='outlined'
                    margin='normal'
                    value={field.value || ''}
                    error={!!errors.prizes?.[0]?.name}
                    helperText={errors.prizes?.[0]?.name ? errors.prizes[0].name.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item container alignItems='center' direction='row' xs={4}>
              <Typography mr={1} variant='subtitle2' align='left'>
                名額:
              </Typography>
              <Controller
                name={`prizes[0].quota`}
                control={control}
                rules={{
                  required: '名額不能為空!',
                  min: { value: 1, message: '獎項名額數量要大於0' },
                }}
                render={({ field }) => (
                  <TextField
                    InputProps={{
                      endAdornment: <InputAdornment position='end'>位</InputAdornment>,
                      inputProps: { min: 1, style: { textAlign: 'center' } },
                    }}
                    {...field}
                    type='number'
                    sx={{ height: '60px', flex: 1 }}
                    variant='outlined'
                    margin='normal'
                    value={field.value || ''}
                    error={!!errors.prizes?.[0]?.quota}
                    helperText={errors.prizes?.[0]?.quota ? errors.prizes[0].quota.message : ''}
                  />
                )}
              />
            </Grid>
          </Grid>
        </FormControl>
        <FormControl fullWidth sx={{ marginTop: '12px' }}>
          <Typography mr={1} variant='h5' align='left'>
            額外限制
          </Typography>
          <Grid
            item
            container
            direction='row'
            alignItems='center'
            sx={{
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Typography mr={1} variant='subtitle1' align='left'>
              #1 可以重複中獎
            </Typography>
            <Controller
              name={`extraConditions.allowRepeatWinning`}
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  defaultChecked={false}
                />
              )}
            />
          </Grid>
          <Grid container alignItems='center'>
            <Grid
              item
              container
              direction='row'
              sx={{
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'none', sm: 'center' },
              }}
            >
              <Typography mr={1} mt={1} variant='subtitle1' align='left'>
                #2 Tag好友限制: 每則留言內容至少需要 Tag
              </Typography>
              <Controller
                name={`extraConditions.requiredTagCount`}
                control={control}
                render={({ field }) => (
                  <TextField
                    InputProps={{
                      endAdornment: <InputAdornment position='end'>位好友</InputAdornment>,
                      inputProps: { min: 0, style: { textAlign: 'center' } },
                    }}
                    {...field}
                    type='number'
                    sx={{ height: '60px', flex: 1 }}
                    variant='outlined'
                    margin='normal'
                    value={field.value || ''}
                    error={!!errors.extraConditions?.requiredTagCount}
                    helperText={
                      errors.extraConditions?.requiredTagCount
                        ? errors.extraConditions?.requiredTagCount.message
                        : ''
                    }
                  />
                )}
              />
            </Grid>
            <Grid
              item
              container
              direction='row'
              sx={{
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'none', sm: 'center' },
              }}
            >
              <Typography mr={1} variant='subtitle1' align='left'>
                #3 留言內容限制: 留言內容須包含 文字
              </Typography>
              <Controller
                name={`extraConditions.requiredTextContent`}
                control={control}
                rules={{
                  maxLength: { value: 50, message: '限定字串不能超過 50 字!' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ height: '60px', flex: 1 }}
                    label='留言內容須包含字串'
                    variant='outlined'
                    margin='normal'
                    value={field.value || ''}
                    error={!!errors.extraConditions?.requiredTextContent}
                    helperText={
                      errors.extraConditions?.requiredTextContent
                        ? errors.extraConditions?.requiredTextContent.message
                        : ''
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
        </FormControl>
        <CardActions sx={{ flexDirection: { xs: 'column', sm: 'row' }, marginTop: '8px' }}>
          {isActivitySettingApplied ? (
            <Button
              variant='contained'
              sx={{ width: '100%' }}
              style={LotteryDrawBtnStyle}
              startIcon={<SaveIcon />}
              color='primary'
              onClick={handleLotteryDrawBtnClick}
            >
              開獎!
            </Button>
          ) : (
            <Button
              variant='contained'
              sx={{ width: '100%' }}
              style={ApplySettingsBtnStyle}
              startIcon={<SaveIcon />}
              onClick={handleApplyBtnClick}
            >
              套用設定
            </Button>
          )}
        </CardActions>
      </form>
      <CustomSnackbar
        open={snackbarOpen}
        message={snackBarMessage.applySetting}
        severity='info'
        autoHideDuration={3000}
        onClose={handleSnackbarOnClose}
      />
    </Paper>
  );
};

export default IgLotterySettingContainer;
