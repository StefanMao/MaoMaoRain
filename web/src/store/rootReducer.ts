import { combineReducers } from 'redux';
import userReducer from './faceBookLogin/userDataSlice';
import instagramReducer from './InstagramStore/instagramSlice';

const rootReducer = combineReducers({
  userData: userReducer,
  instagramAccountData: instagramReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
