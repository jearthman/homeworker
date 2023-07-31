import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export type Theme = "light" | "dark";

interface ThemeState {
  value: Theme;
}

// You can directly set the initial state to 'light' here.
const initialState: ThemeState = {
  value: "light",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.value = state.value === "dark" ? "light" : "dark";
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

// Other code...

export default themeSlice.reducer;
