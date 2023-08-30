import React from 'react';
import Button from '@mui/material/Button';

interface Props {
  onClick: () => void;
}

const FaceBookLoginBtn: React.FC<Props> = ({ onClick }) => {
  return (
    <Button variant='contained' color='primary' onClick={onClick}>
      使用FaceBook身份登入
    </Button>
  );
};
export default FaceBookLoginBtn;
