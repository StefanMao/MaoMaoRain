import React from 'react';
import { Grid, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Grid mt={4} container sx={{ height: '100px', backgroundColor: '#519F9F' }} justifyContent='center' alignContent='center'>
      <Typography>© 2023 Social Pluse Hub</Typography>
    </Grid>
  );
};

export default Footer;
