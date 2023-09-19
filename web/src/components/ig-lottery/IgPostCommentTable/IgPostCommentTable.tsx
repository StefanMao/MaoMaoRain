import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  IInstagramPost,
  IInstagramStore,
  IInstagramComment,
} from '../../../utils/Instagram/instagramInterface';
import { instagramData } from '../../../store/InstagramStore/selectors';

import {
  Table,
  // TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  // TableSortLabel,
  // TablePagination,
} from '@mui/material';

import { FacebookSDK } from '../../../utils/facebook/faceBookSdk';
import { saveCurrentPostComments } from '../../../store/InstagramStore/instagramSlice';

interface IgPostCommentTableStates {
  selectedPost: IInstagramPost | null;
}

interface IgPostCommentTableActions {
  getComments: () => Promise<void>;
}

export const useHook = (): [IgPostCommentTableStates, IgPostCommentTableActions] => {
  const dispatch = useDispatch();
  const { selectedPost, currentPostComments }: IInstagramStore = useSelector(instagramData);

  const getComments = async (): Promise<void> => {
    try {
      if (!selectedPost) {
        console.error('No selected post to fetch comments for.');
        return;
      }

      const fbSdkInstance = await FacebookSDK.getInstance();
      const response: IInstagramComment[] = await fbSdkInstance.getPostComments(selectedPost.id);
    
      if (!response) {
        console.error('Failed to fetch comments.');
        return;
      }
    
      dispatch(saveCurrentPostComments(response));
    } catch (error) {
      console.error('An error occurred while fetching comments:', error);
    }
  };

  React.useEffect(() => {
    getComments();
  }, [selectedPost]);

  React.useEffect(() => {
    console.log('currentPostComments', currentPostComments);
  }, [currentPostComments]);

  const states: IgPostCommentTableStates = { selectedPost };
  const actions: IgPostCommentTableActions = { getComments };

  return [states, actions];
};

const IgPostCommentTable: React.FC = () => {
  const [states] = useHook();
  const { selectedPost } = states;
  console.log('selectedPost', selectedPost);
  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell>
                <TableSortLabel
                  active={orderBy === 'timestamp'}
                  direction={order}
                  onClick={handleSort('timestamp')}
                >
                  Timestamp
                </TableSortLabel>
              </TableCell> */}
              <TableCell>
                {/* <TableSortLabel
                  active={orderBy === 'from.username'}
                  direction={order}
                  onClick={handleSort('from.username')}
                >
                  Username
                </TableSortLabel> */}
              </TableCell>
              <TableCell>Text</TableCell>
            </TableRow>
          </TableHead>
          {/* <TableBody>
            {sortedComments
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell>{comment.timestamp}</TableCell>
                  <TableCell>{comment.from.username}</TableCell>
                  <TableCell>{comment.text}</TableCell>
                </TableRow>
              ))}
          </TableBody> */}
        </Table>
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={comments.data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
    </div>
  );
};
export default IgPostCommentTable;
