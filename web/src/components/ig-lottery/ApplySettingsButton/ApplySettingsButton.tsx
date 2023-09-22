import React from 'react';

import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';

import { ApplySettingsBtnStyle } from './ApplySettingsButtonStyle';

export const useHook = () => {
  return;
};

const ApplySettingsButton: React.FC = () => {
  return (
    <Button
      variant='contained'
      sx={{ width: '100%' }}
      style={ApplySettingsBtnStyle}
      startIcon={<SaveIcon />}
    >
      套用設定
    </Button>
  );
};

export default ApplySettingsButton;
