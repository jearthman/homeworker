// themeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';

let storedTheme: Theme | string = 'light'; // Default to 'light' theme

if (typeof window !== 'undefined') {
  const item = localStorage.getItem('color-theme');
  if (item === 'light' || item === 'dark') {
    storedTheme = item as Theme;
  }
}

interface ThemeState {
  value: Theme;
}

  const initialState: ThemeState = {
    value: storedTheme as Theme,
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