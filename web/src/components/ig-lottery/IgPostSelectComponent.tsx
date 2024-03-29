import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  Select,
  MenuItem,
  FormControl,
  Box,
  Typography,
  Chip,
  Divider,
  IconButton,
  Grid,
  Tooltip,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { IInstagramPost, IInstagramStore } from '../../utils/Instagram/instagramInterface';
import { instagramData } from '../../store/InstagramStore/selectors';

import { FacebookSDK } from '../../utils/facebook/faceBookSdk';
import { formatTimestamp } from '../../utils/moment/moment';
import {
  menuItemContentStyle,
  menuItemPostContentStyle,
  menuItemDividerStyle,
  BootstrapInput,
} from './IgPostSelectComponentStyle';
import { saveSelectedPost, saveLotteryResults } from '../../store/InstagramStore/instagramSlice';

interface IgPostSelectComponentActions {
  getIgPosts: () => Promise<void>;
  handleSelectPostChange: (event: SelectChangeEvent<IInstagramPost | null>) => void;
  initSelectPostDefault: () => void;
  openIgPostUrl: () => void;
}

interface IgPostSelectComponentStates {
  postDatas: IInstagramPost[];
  selectedPost: IInstagramPost | null;
}

export const useHook = (): [IgPostSelectComponentStates, IgPostSelectComponentActions] => {
  const dispatch = useDispatch();
  const { selectedBusinessAccount, selectedPost }: IInstagramStore = useSelector(instagramData);
  const [postDatas, setPostDatas] = useState<IInstagramPost[]>([]);

  const openIgPostUrl = (): void => {
    if (!selectedPost?.shortcode) return;
    const url = `https://www.instagram.com/p/${selectedPost.shortcode}`;
    window.open(url);
  };

  const handleSelectPostChange = (event: SelectChangeEvent<IInstagramPost | null>): void => {
    const post = event.target.value as IInstagramPost;
    dispatch(saveSelectedPost(post));
    dispatch(saveLotteryResults(null));
  };

  const initSelectPostDefault = () => {
    if (postDatas && postDatas.length > 0) {
      const defaultData = postDatas[0];
      dispatch(saveSelectedPost(defaultData));
    } else {
      dispatch(saveSelectedPost(null));
    }
  };

  const getIgPosts = async (): Promise<void> => {
    const instagramBusinessAccountId = selectedBusinessAccount?.instagram_business_account?.id;
    if (!instagramBusinessAccountId) return;
    const fbSdkInstance = await FacebookSDK.getInstance();
    const result = await fbSdkInstance.getMediaPosts(instagramBusinessAccountId);
    setPostDatas(result.data);
  };

  React.useEffect(() => {
    initSelectPostDefault();
  }, [postDatas]);

  React.useEffect(() => {
    getIgPosts();
  }, [selectedBusinessAccount]);

  const states: IgPostSelectComponentStates = { postDatas, selectedPost };
  const actions: IgPostSelectComponentActions = {
    getIgPosts,
    handleSelectPostChange,
    initSelectPostDefault,
    openIgPostUrl,
  };
  return [states, actions];
};

const IgPostSelectComponent: React.FC = () => {
  const [states, actions] = useHook();
  const { postDatas, selectedPost } = states;
  const { handleSelectPostChange, openIgPostUrl } = actions;

  return (
    <Box>
      <Grid container justifyContent='start'>
        <FormControl sx={{ m: 1, width: '100%' }}>
          <Select
            labelId='custom-select-label'
            value={selectedPost || ''}
            onChange={handleSelectPostChange}
            input={<BootstrapInput />}
            MenuProps={{ PaperProps: { style: { maxHeight: '250px', width: '100px' } } }}
          >
            {postDatas.map((post) => (
              <MenuItem key={post.id} value={post as any}>
                <Chip variant='filled' color='info' size='small' label='發佈時間' />
                <Typography ml={1} style={menuItemContentStyle}>
                  {formatTimestamp(post.timestamp)}
                </Typography>
                <Divider style={menuItemDividerStyle} orientation='vertical' flexItem />
                <IconButton color='primary' onClick={openIgPostUrl}>
                  <OpenInNewIcon />
                </IconButton>
                <Tooltip title={post.caption.length > 200 ? `${post.caption.substring(0, 200)}...` : post.caption} placement="top" arrow>
                  <Typography style={menuItemPostContentStyle}>{post.caption}</Typography>
                </Tooltip>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Box>
  );
};

export default IgPostSelectComponent;
