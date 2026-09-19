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
import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
  count: number;
}

const initialState: ModalState = {
  count: 0,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    incrementModalCount: (state) => { state.count += 1; },
    decrementModalCount: (state) => { state.count = Math.max(0, state.count - 1); },
    resetModalCount: (state) => { state.count = 0; },
  },
});

export const { incrementModalCount, decrementModalCount, resetModalCount } = modalSlice.actions;
export const selectModalCount = (state: { modal: ModalState }) => state.modal.count;

export default modalSlice.reducer;
