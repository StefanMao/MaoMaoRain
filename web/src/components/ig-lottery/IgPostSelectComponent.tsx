import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Select,
  MenuItem,
  FormControl,
  Box,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

import { IInstagramPost, IInstagramStore } from '../../utils/Instagram/instagramInterface';
import { getSelectBusinessAccount } from '../../store/InstagramStore/selectors';

import { FacebookSDK } from '../../utils/facebook/faceBookSdk';
import { formatTimestamp } from '../../utils/moment/moment';
import {
  menuItemContentStyle,
  menuItemPostContentStyle,
  menuItemDividerStyle,
  BootstrapInput,
} from './IgPostSelectComponentStyle';

interface IgPostSelectComponentActions {
  getIgPosts: () => Promise<void>;
  handleSelectPostChange: (event: SelectChangeEvent<IInstagramPost | null>) => void;
  initSelectPostDefault: () => void;
}

interface IgPostSelectComponentStates {
  postDatas: IInstagramPost[];
  selectedPost: IInstagramPost | null;
}

export const useHook = (): [IgPostSelectComponentStates, IgPostSelectComponentActions] => {
  const { businessAccount }: IInstagramStore = useSelector(getSelectBusinessAccount);

  const [postDatas, setPostDatas] = useState<IInstagramPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<IInstagramPost | null>(null);

  const handleSelectPostChange = (event: SelectChangeEvent<IInstagramPost | null>): void => {
    const post = event.target.value as IInstagramPost;
    console.log('handleSelectPostChange', post);
    setSelectedPost(post);
  };

  const initSelectPostDefault = () => {
    if (postDatas && postDatas.length > 0) {
      const defaultData = postDatas[0];
      setSelectedPost(defaultData);
    } else {
      setSelectedPost(null);
    }
  };

  const getIgPosts = async (): Promise<void> => {
    const instagramBusinessAccountId = businessAccount?.instagram_business_account?.id;
    if (!instagramBusinessAccountId) return;
    const fbSdkInstance = await FacebookSDK.getInstance();
    const result = await fbSdkInstance.getMediaPosts(instagramBusinessAccountId);
    setPostDatas(result.data);
  };

  React.useEffect(() => {
    initSelectPostDefault();
  }, [postDatas]);

  React.useEffect(() => {
    console.log('businessAccount', businessAccount);
    getIgPosts();
  }, [businessAccount]);

  React.useEffect(() => {
    console.log('selectedPost', selectedPost);
  }, [selectedPost]);

  const states: IgPostSelectComponentStates = { postDatas, selectedPost };
  const actions: IgPostSelectComponentActions = {
    getIgPosts,
    handleSelectPostChange,
    initSelectPostDefault,
  };
  return [states, actions];
};

const IgPostSelectComponent: React.FC = () => {
  const [states, actions] = useHook();
  const { postDatas, selectedPost } = states;
  const { handleSelectPostChange } = actions;

  return (
    <Box>
      <FormControl sx={{ m: 1, width: '100%' }}>
        <Select
          labelId='custom-select-label'
          value={selectedPost}
          onChange={handleSelectPostChange}
          input={<BootstrapInput />}
        >
          {postDatas.map((post) => (
            <MenuItem key={post.id} value={post as any}>
              <Chip variant='filled' color='info' size='small' label='發佈時間' />
              <Typography ml={2} style={menuItemContentStyle}>
                {formatTimestamp(post.timestamp)}
              </Typography>
              <Divider style={menuItemDividerStyle} orientation='vertical' flexItem />
              <Typography style={menuItemPostContentStyle}>{post.caption}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default IgPostSelectComponent;
