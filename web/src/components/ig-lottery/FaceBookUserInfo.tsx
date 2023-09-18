import React from 'react';

import { Paper, Typography } from '@mui/material';

import { userInfoTypographyStyle } from './FaceBookUserInfoStyle';

interface FaceBookUserInfoProps {
  userData?: {
    email?: string;
    account?: string;
    name?: string;
    userID?: string;
  };
}

const FaceBookUserInfo: React.FC<FaceBookUserInfoProps> = ({ userData }) => {
  if (!userData) {
    return null;
  }

  return (
    <Paper elevation={3} sx={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <Typography
        align='left'
        variant='h6'
        sx={{ marginBottom: '16px', fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}
      >
        FB帳號連結資訊
      </Typography>
      <Typography sx={userInfoTypographyStyle}>名稱: {userData.name}</Typography>
      <Typography sx={userInfoTypographyStyle}>使用者ID: {userData.userID}</Typography>
      <Typography sx={userInfoTypographyStyle}>Email: {userData.email}</Typography>
    </Paper>
  );
};

export default FaceBookUserInfo;
