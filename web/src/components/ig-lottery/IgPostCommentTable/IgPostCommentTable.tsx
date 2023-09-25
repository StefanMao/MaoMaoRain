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
import { fakeCommentData } from '../../../utils/const/fakeData';

import { tableStyle } from './IgPostCommentTableStyle';

interface IgPostCommentTableProps {
  commentData: IInstagramComment[] | [];
}
interface IgPostCommentTableStates extends IgPostCommentTableProps {
  selectedPost: IInstagramPost | null;
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

export const useHook = (
  props: IgPostCommentTableProps,
): [IgPostCommentTableStates, IgPostCommentTableActions] => {
  const { commentData } = props;
  const dispatch = useDispatch();
  const { selectedPost }: IInstagramStore = useSelector(instagramData);
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
    return commentData.slice(startIndex, endIndex);
  };

  const isCurrentPostCommentsEmpty = !commentData.length;

  const getComments = async (): Promise<void> => {
    try {
      if (!selectedPost) {
        // console.error('No selected post to fetch comments for.');
        return;
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
      response.comments.data = fakeCommentData();
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

  const states: IgPostCommentTableStates = {
    selectedPost,
    isLoading,
    page,
    rowsPerPage,
    isCurrentPostCommentsEmpty,
    commentData,
  };
  const actions: IgPostCommentTableActions = {
    getComments,
    handleChangePage,
    handleChangeRowsPerPage,
    getCommentsToDisplay,
  };

  return [states, actions];
};

const IgPostCommentTable: React.FC<IgPostCommentTableProps> = (props) => {
  const [states, actions] = useHook(props);
  const { isLoading, rowsPerPage, page, isCurrentPostCommentsEmpty, commentData } = states;
  const { handleChangePage, handleChangeRowsPerPage, getCommentsToDisplay } = actions;
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {isLoading && <CircularProgress />}
      <TableContainer component={Paper} sx={{ height: 450 }}>
        <Table stickyHeader style={tableStyle}>
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
                    暫無資料!
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              getCommentsToDisplay().map((comment: IInstagramComment, index: number) => (
                <TableRow key={comment.id}>
                  <TableCell sx={{ width: 60 }}>{index + 1}</TableCell>
                  <TableCell sx={{ width: 100 }}>{comment.from.username}</TableCell>
                  <TableCell>{comment.text}</TableCell>
                  <TableCell sx={{ width: 120 }}>
                    {formatTimestampWithTime(comment.timestamp)}
                  </TableCell>
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
          count={commentData.length}
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
