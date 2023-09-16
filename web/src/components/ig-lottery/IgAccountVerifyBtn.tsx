import React from 'react';

import Button from '@mui/material/Button';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import { permissionIgVerifyScope } from '../../utils/facebook/faceBookPermission';

interface IgAccountVerifyBtnActions {
  handleBtnClick: () => void;
}

export const useHook = (): [IgAccountVerifyBtnActions] => {
  const handleBtnClick = (): void => {
    const clientId = process.env.REACT_APP_FB_APP_ID;
    const version = process.env.REACT_APP_FB_APP_VERSION;
    const redirectUri = process.env.REACT_APP_DEV_IG_LOTTERY_REDIRECT_URI;
    const permissionScope = [
      ...permissionIgVerifyScope.instagram,
      ...permissionIgVerifyScope.pages,
    ].join(',');

    const url = `https://www.facebook.com/${version}/dialog/oauth?client_id=${clientId}&display=page&domain=${process.env.REACT_APP_DEV_DOMAIN}&redirect_uri=${redirectUri}&response_type=token&scope=${permissionScope}`;
    window.location.href = url;
  };

  const actios: IgAccountVerifyBtnActions = { handleBtnClick };
  return [actios];
};

const IgAccountVerifyBtn: React.FC = () => {
  const [actions] = useHook();
  const { handleBtnClick } = actions;
  return (
    <Button startIcon={<VerifiedUserIcon />} variant='outlined' onClick={handleBtnClick}>
      編輯授權
    </Button>
  );
};

export default IgAccountVerifyBtn;
