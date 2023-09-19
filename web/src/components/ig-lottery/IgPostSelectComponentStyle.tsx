import { CSSProperties } from 'react';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

export const BootstrapInput = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 14,
    padding: '12px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}));

// export const selectPostInputStyle: CSSProperties = {
//   border:'1px solid red',
// };

export const menuItemDividerStyle: CSSProperties = {
  margin: '0px 12px',
};

export const menuItemPostContentStyle: CSSProperties = {
  marginLeft: '4px',
  flex: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: '16px',
  color: '#555',
};

export const menuItemContentStyle: CSSProperties = {
  fontSize: '16px',
  color: '#555',
};
