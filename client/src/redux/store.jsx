
//src/redux/store.jsx
import { configureStore } from '@reduxjs/toolkit';

import editorReducer from './slices/codeSlice';




export const store = configureStore({
  reducer: {
    
    editor: editorReducer,
    

  },
});
export default store;
