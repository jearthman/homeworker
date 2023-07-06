// themeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';

const storedTheme = localStorage.getItem('color-theme') as Theme || 'light';

interface ThemeState {
  value: Theme;
}

const initialState: ThemeState = {
  value: storedTheme,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    switchTheme: (state) => {
      state.value = state.value === 'dark' ? 'light' : 'dark';
      localStorage.setItem('color-theme', state.value);
    },
  },
});

export const { switchTheme } = themeSlice.actions;

export default themeSlice.reducer;