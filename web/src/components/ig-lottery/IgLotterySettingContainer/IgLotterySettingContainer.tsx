import React from 'react';
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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';

import { ApplySettingsBtnStyle } from './IgLotterySettingContainerStyle';
import {
  ILotteryActivitySettings,
  IInstagramPost,
} from '../../../utils/Instagram/instagramInterface';
import { instagramData } from '../../../store/InstagramStore/selectors';
import {
  saveCurrentLotterySetting,
  updateLotterySettingFormErrorStatus,
} from '../../../store/InstagramStore/instagramSlice';

interface IgLotterySettingContainerStates {
  currentLotterySetting: ILotteryActivitySettings;
  control: Control;
  selectedPost: IInstagramPost | null;
  errors: FieldErrors<ILotteryActivitySettings>;
}

interface IgLotterySettingContainerActions {
  handleClearFieldsBtnClick: () => void;
  handleApplyBtnClick: () => void;
  getValues: (field: string) => Record<string, any>;
}

export const useHook = (): [IgLotterySettingContainerStates, IgLotterySettingContainerActions] => {
  const dispatch = useDispatch();
  const { currentLotterySetting, selectedPost } = useSelector(instagramData);

  const {
    control,
    getValues,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: 'onChange' });

  const handleClearFieldsBtnClick = (): void => {
    setFormDefaultValues();
    dispatch(updateLotterySettingFormErrorStatus(false));
  };

  const handleApplyBtnClick = handleSubmit((data) => {
    dispatch(saveCurrentLotterySetting(data as ILotteryActivitySettings));
  });

  const setFormDefaultValues = (): void => {
    reset(currentLotterySetting);
  };

  const updateSettingFormErrorStatus = (errors: FieldErrors<ILotteryActivitySettings>): void => {
    console.log('updateSettingFormErrorStatus', errors);
    if (Object.keys(errors).length !== 0) {
      dispatch(updateLotterySettingFormErrorStatus(true));
    } else {
      dispatch(updateLotterySettingFormErrorStatus(false));
    }
  };

  React.useEffect(() => {
    setFormDefaultValues();
  }, [selectedPost]);

  React.useEffect(() => {
    updateSettingFormErrorStatus(errors);
  }, [errors]);

  React.useEffect(() => {
    console.log('currentLotterySetting', currentLotterySetting);
  }, [currentLotterySetting]);

  const states: IgLotterySettingContainerStates = {
    currentLotterySetting,
    control,
    selectedPost,
    errors,
  };

  const actions: IgLotterySettingContainerActions = {
    handleClearFieldsBtnClick,
    getValues,
    handleApplyBtnClick,
  };
  return [states, actions];
};

const IgLotterySettingContainer: React.FC = () => {
  const [states, actions] = useHook();
  const { control, errors } = states;
  const { handleClearFieldsBtnClick, getValues, handleApplyBtnClick } = actions;

  return (
    <Paper elevation={2} sx={{ padding: '12px' }}>
      <form onSubmit={() => {}}>
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
                  <DatePicker
                    {...field}
                    sx={{ height: '60px', width: '100%' }}
                    value={moment(field.value) || moment()}
                    minDate={moment(getValues('activeTime.startDate'))}
                    format='YYYY-MM-DD'
                  />
                )}
              />
            </Grid>
          </Grid>
        </FormControl>
        <FormControl fullWidth sx={{ flexDirection: 'row', marginTop: '8px' }}>
          <Grid container alignItems='center' mt={1} direction='row' spacing={2}>
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
                      inputProps: { min: 1 },
                    }}
                    {...field}
                    type='number'
                    sx={{ height: '60px', flex: 1 }}
                    label='名額'
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
        <CardActions sx={{ flexDirection: { xs: 'column', sm: 'row' }, marginTop: '8px' }}>
          <Button
            variant='contained'
            sx={{ width: '100%' }}
            style={ApplySettingsBtnStyle}
            startIcon={<SaveIcon />}
            onClick={handleApplyBtnClick}
          >
            套用設定
          </Button>
        </CardActions>
      </form>
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
    </Paper>
  );
};

export default IgLotterySettingContainer;
