/*
 * Happy Number - Open Source Math Game
 *
 * This is an open-source project of https://math-hero.online and https://happy-number.online
 * The author of this project is TNQ MEDIA
 * GitHub: https://github.com/xcoj027/happy-number-lite
 *
 * You are free to clone, modify, contribute, fork, and build commercial products
 * from this project. All pull requests are welcome.
 * You can also open any issues or report bugs.

 */
import { configureStore } from '@reduxjs/toolkit';
import gameSessionReducer from './slices/gameSessionSlice';
import modalReducer from './slices/modalSlice';

export const store = configureStore({
  reducer: {
    gameSession: gameSessionReducer,
    modal: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
