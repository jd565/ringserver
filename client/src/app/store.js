import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import reduxWebsocket from '@giantmachines/redux-websocket';
import counterReducer from '../features/counter/counterSlice';
import ringerReducer from '../features/ringer/ringerSlice';

const middleware = [...getDefaultMiddleware(), reduxWebsocket()]

export default configureStore({
  reducer: {
    counter: counterReducer,
    ringer: ringerReducer,
  },
  middleware
});
