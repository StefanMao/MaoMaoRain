import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Box, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

import { FaceBookFanAccount, FacebookFanAccountsData } from '../../utils/facebook/faceBookSdkTypes';

import { saveSelectBusinessAccount } from '../../store/InstagramStore/instagramSlice';

interface IgAccountContentProps {
  accounts?: FacebookFanAccountsData;
}

interface IgAccountContentActions {
  handleFanPageChange: (event: SelectChangeEvent<FaceBookFanAccount | null>) => void;
  initSelectAccountDefault: () => void;
}
interface IgAccountContentStates {
  selectedIgAccount: FaceBookFanAccount | null;
  isSelectDisabled: boolean;
}

export const useHook = (props: IgAccountContentProps): [IgAccountContentStates, IgAccountContentActions] => {
  const dispatch = useDispatch();
  const { accounts } = props;
  const [selectedIgAccount, setSelectedIgAccount] = useState<FaceBookFanAccount | null>(null);
  const [isSelectDisabled, setIsSelectDisabled] = useState<boolean>(false);


  const handleFanPageChange = (event: SelectChangeEvent<FaceBookFanAccount | null>) => {
    const selectedAccount = event.target.value as FaceBookFanAccount;
    setSelectedIgAccount(selectedAccount);
    dispatch(saveSelectBusinessAccount(selectedAccount));
  };

  const initSelectAccountDefault = (): void => {
    if (accounts && accounts.data.length > 0) {
      const defaultData = accounts.data[0];
      setSelectedIgAccount(defaultData);
      dispatch(saveSelectBusinessAccount(defaultData));
      setIsSelectDisabled(false);
    } else {
      setSelectedIgAccount(null);
      setIsSelectDisabled(true);
      dispatch(saveSelectBusinessAccount(null));
    }
  };

  React.useEffect(() => {
    initSelectAccountDefault();
  }, [accounts]);

  React.useEffect(() => {
    console.log('selectedIgAccount', selectedIgAccount);
    console.log('isSelectDisabled', isSelectDisabled);
    console.log('accounts', accounts)
  }, [selectedIgAccount, isSelectDisabled, accounts]);

  const actions: IgAccountContentActions = { handleFanPageChange, initSelectAccountDefault };
  const states: IgAccountContentStates = {
    selectedIgAccount,
    isSelectDisabled,
  };

  return [states, actions];
};

const IgAccountContent: React.FC<IgAccountContentProps> = (props) => {
  const { accounts } = props;
  const [states, actions] = useHook(props);

  const { selectedIgAccount, isSelectDisabled } = states;
  const { handleFanPageChange } = actions;

  return (
    <Box>
      <Grid container justifyContent='start'>
        <FormControl sx={{ m: 1, width: '100%' }}>
          <InputLabel>粉絲專頁</InputLabel>
          <Select
            name='ig-account-select'
            value={selectedIgAccount || ''}
            label='粉絲專頁'
            onChange={handleFanPageChange}
            placeholder='請選擇粉絲專頁'
            disabled={isSelectDisabled}
          >
            {accounts?.data.map((account) => (
              <MenuItem key={account.id} value={account as any}>
                {account.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Box>
  );
};

export default IgAccountContent;
