import React from 'react';
import { Grid, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Grid mt={4} container sx={{ height: '100px', backgroundColor: '#1976d2' }} alignContent='center'>
      <Typography>© 2023 Social Pluse Hub</Typography>
    </Grid>
  );
};

export default Footer;
