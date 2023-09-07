import { combineReducers } from 'redux';
import userReducer from './faceBookLogin/userDataSlice'; // 根据你的实际文件路径调整

const rootReducer = combineReducers({
  userData: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
