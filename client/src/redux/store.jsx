import { configureStore } from '@reduxjs/toolkit';
import editorReducer from './slices/codeSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    user: userReducer,
  },
});
export default store;