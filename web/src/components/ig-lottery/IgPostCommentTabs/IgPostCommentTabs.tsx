import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { Box, Tabs, Tab, Typography } from '@mui/material';

import IgPostCommentTable from '../IgPostCommentTable/IgPostCommentTable';
import {
  saveCurrentNonQualifiedComments,
  saveCurrentQualifiedComments,
} from '../../../store/InstagramStore/instagramSlice';
import {
  IInstagramComment,
  IInstagramPost,
  IInstagramStore,
  ILotteryActivitySettings,
} from '../../../utils/Instagram/instagramInterface';
import { instagramData } from '../../../store/InstagramStore/selectors';

const tabsMenu = [
  {
    key: 'allComments',
    label: '所有留言',
  },
  {
    key: 'qualifiedComments',
    label: '符合抽獎條件',
  },
  {
    key: 'nonQualifiedComments',
    label: '不符合條件',
  },
];

interface FilterParams {
  selectedPost: IInstagramPost;
  lotterySetting: ILotteryActivitySettings;
  commentData: IInstagramComment[] | [];
}

interface IgPostCommentTabsStates {
  selectedTab: number;
  currentPostComments: IInstagramComment[] | [];
  currentQualifiedComments: IInstagramComment[] | [];
  currentNonQualifiedComments: IInstagramComment[] | [];
  currentLotterySetting: ILotteryActivitySettings;
  islotterySettingFormError: boolean;
}

interface IgPostCommentTabsActions {
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  getNumberOfComments: (tabKey: string) => number;
  shouldShowTab: (activityName: string | undefined, tabKey: string) => boolean;
}

export const useHook = (): [IgPostCommentTabsStates, IgPostCommentTabsActions] => {
  const dispatch = useDispatch();
  const {
    selectedPost,
    currentPostComments,
    currentLotterySetting,
    currentQualifiedComments,
    currentNonQualifiedComments,
    islotterySettingFormError,
  }: IInstagramStore = useSelector(instagramData);
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const shouldShowTab = (activityName: string | undefined, tabKey: string) => {
    return ((tabKey === 'allComments') || (!islotterySettingFormError && activityName !== ''));
  };

  /**
   * Filter comments based on active time defined in lottery settings.
   *
   * @param {Object} filterParams - Filter parameters containing lotterySetting and commentData.
   * @returns {Array} - An array of comments within the active time.
   */
  const filterActiveTime = (filterParams: FilterParams) => {
    const { lotterySetting, commentData } = filterParams;

    const isCommentWithinActiveTime = (comment: IInstagramComment) => {
      const commentTimestamp = moment(comment.timestamp);
      const { startDate, endDate } = lotterySetting.activeTime;
      return commentTimestamp.isBetween(startDate, endDate, null, '[]');
    };

    const filteredComments = commentData.filter(isCommentWithinActiveTime);

    return filteredComments;
  };

  /**
   * Get non-qualified comments from original data and filtered data, and save them in Redux.
   *
   * @param {Array} originalData - The original comment data.
   * @param {Array} filteredData - The filtered comment data.
   */
  const getNonQualifiedComments = (
    originalData: IInstagramComment[] | [],
    filteredData: IInstagramComment[] | [],
  ) => {
    const filteredDataIds = new Set(filteredData.map((comment: IInstagramComment) => comment.id));
    const filteredOutComments = originalData.filter((comment) => !filteredDataIds.has(comment.id));

    dispatch(saveCurrentNonQualifiedComments(filteredOutComments));
  };

  const getQualifiedComments = (filterParams: FilterParams): void => {
    const { selectedPost, lotterySetting, commentData } = filterParams;
    let resultComments = [...commentData];

    // 過濾抽獎活動截止日期
    resultComments = filterActiveTime({
      selectedPost,
      lotterySetting,
      commentData: resultComments,
    });

    dispatch(saveCurrentQualifiedComments(resultComments));

    // 取得沒有符合條件的留言
    getNonQualifiedComments(commentData, resultComments);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const getNumberOfComments = (tabKey: string): number => {
    switch (tabKey) {
      case 'allComments':
        return currentPostComments.length;
      case 'qualifiedComments':
        return currentQualifiedComments.length;
      case 'nonQualifiedComments':
        return currentNonQualifiedComments.length;
      default:
        return 0;
    }
  };

  React.useEffect(() => {
    if (selectedPost && currentLotterySetting) {
      const filterParams = {
        selectedPost,
        lotterySetting: currentLotterySetting,
        commentData: currentPostComments,
      };
      getQualifiedComments(filterParams);
    }
  }, [selectedPost, currentPostComments]);

  const states: IgPostCommentTabsStates = {
    selectedTab,
    currentPostComments,
    currentQualifiedComments,
    currentNonQualifiedComments,
    currentLotterySetting,
    islotterySettingFormError,
  };
  const actions: IgPostCommentTabsActions = {
    handleTabChange,
    getNumberOfComments,
    shouldShowTab,
  };
  return [states, actions];
};

const IgPostCommentTabs: React.FC = () => {
  const [states, actions] = useHook();
  const {
    selectedTab,
    currentPostComments,
    currentQualifiedComments,
    currentNonQualifiedComments,
    currentLotterySetting,
  } = states;
  const { handleTabChange, getNumberOfComments, shouldShowTab } = actions;

  return (
    <Box mt={4}>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        indicatorColor='primary'
        textColor='primary'
      >
        {tabsMenu.map(
          (tab) =>
            shouldShowTab(currentLotterySetting.activityName, tab.key) && (
              <Tab
                key={tab.key}
                label={
                  <Typography
                    variant='body1'
                    color={tab.key === 'nonQualifiedComments' ? 'error' : 'null'}
                  >
                    {`${tab.label}(${getNumberOfComments(tab.key)}則)`}
                  </Typography>
                }
              />
            ),
        )}
      </Tabs>
      <Box py={2}>
        {selectedTab === 0 && <IgPostCommentTable commentData={currentPostComments} />}
        {selectedTab === 1 && <IgPostCommentTable commentData={currentQualifiedComments} />}
        {selectedTab === 2 && <IgPostCommentTable commentData={currentNonQualifiedComments} />}
      </Box>
    </Box>
  );
};

export default IgPostCommentTabs;
