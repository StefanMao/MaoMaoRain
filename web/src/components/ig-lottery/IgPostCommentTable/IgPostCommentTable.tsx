import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  IInstagramPost,
  IInstagramStore,
  IInstagramComment,
} from '../../../utils/Instagram/instagramInterface';
import { instagramData } from '../../../store/InstagramStore/selectors';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  TablePagination,
} from '@mui/material';

import { FacebookSDK } from '../../../utils/facebook/faceBookSdk';
import { saveCurrentPostComments } from '../../../store/InstagramStore/instagramSlice';
import { formatTimestampWithTime } from '../../../utils/moment/moment';

interface IgPostCommentTableStates {
  selectedPost: IInstagramPost | null;
  currentPostComments: IInstagramComment[] | [];
  isLoading: boolean;
  page: number;
  rowsPerPage: number;
  isCurrentPostCommentsEmpty: boolean;
}

interface IgPostCommentTableActions {
  getComments: () => Promise<void>;
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  getCommentsToDisplay: () => IInstagramComment[];
}

interface HeadCell {
  id: keyof IInstagramComment | 'number';
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'number',
    label: 'No.',
    numeric: true,
  },
  {
    id: 'username',
    label: '使用者名稱',
    numeric: false,
  },
  {
    id: 'text',
    label: '留言內容',
    numeric: false,
  },
  {
    id: 'timestamp',
    label: '留言時間',
    numeric: false,
  },
];

export const useHook = (): [IgPostCommentTableStates, IgPostCommentTableActions] => {
  const dispatch = useDispatch();
  const { selectedPost, currentPostComments }: IInstagramStore = useSelector(instagramData);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getCommentsToDisplay = (): IInstagramComment[] => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return currentPostComments.slice(startIndex, endIndex);
  };

  const isCurrentPostCommentsEmpty = !currentPostComments.length;

  const getComments = async (): Promise<void> => {
    try {
      if (!selectedPost) {
        // console.error('No selected post to fetch comments for.');
        return;
      }

      const fakeComments = [];
      for (let i = 0; i < 100; i++) {
        const comment = {
          id: `comment-${i + 1}`,
          text: `這是第 ${i + 1} 條留言的內容。`,
          username: `user${i + 1}`,
          timestamp: `2023-01-01`,
          like_count: 0,
          from: {
            id: '11111',
            username: '2222',
          },
        };
        fakeComments.push(comment);
      }

      const fbSdkInstance = await FacebookSDK.getInstance();
      setIsLoading(true);
      const response: IInstagramPost = await fbSdkInstance.getPostComments(selectedPost.id);
      console.log('getComments', response);
      if (!response?.comments?.data) {
        console.error('Failed to fetch comments.');
        dispatch(saveCurrentPostComments([]));
        return;
      }
      response.comments.data = fakeComments;
      dispatch(saveCurrentPostComments(response.comments.data));
    } catch (error) {
      console.error('An error occurred while fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    getComments();
  }, [selectedPost]);

  React.useEffect(() => {
    console.log('currentPostComments', currentPostComments);
  }, [currentPostComments]);

  const states: IgPostCommentTableStates = {
    selectedPost,
    currentPostComments,
    isLoading,
    page,
    rowsPerPage,
    isCurrentPostCommentsEmpty,
  };
  const actions: IgPostCommentTableActions = {
    getComments,
    handleChangePage,
    handleChangeRowsPerPage,
    getCommentsToDisplay,
  };

  return [states, actions];
};

const IgPostCommentTable: React.FC = () => {
  const [states, actions] = useHook();
  const {
    currentPostComments,
    isLoading,
    rowsPerPage,
    page,
    isCurrentPostCommentsEmpty,
  } = states;
  const { handleChangePage, handleChangeRowsPerPage, getCommentsToDisplay } = actions;
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {isLoading && <CircularProgress />}
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {/* Header */}
              {headCells.map((headCell) => (
                <TableCell key={headCell.id}>{headCell.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isCurrentPostCommentsEmpty ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant='body2' color='error'>
                    這篇貼文沒有留言!
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              getCommentsToDisplay().map((comment: IInstagramComment, index: number) => (
                <TableRow key={comment.id}>
                  <TableCell sx={{ width: 60 }}>{index + 1}</TableCell>
                  <TableCell sx={{ width: 100 }}>{comment.from.username}</TableCell>
                  <TableCell>{comment.text}</TableCell>
                  <TableCell sx={{ width: 120 }}>{formatTimestampWithTime(comment.timestamp)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {!isCurrentPostCommentsEmpty && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component='div'
          count={currentPostComments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ mx: 'auto' }}
        />
      )}
    </Paper>
  );
};
export default IgPostCommentTable;
