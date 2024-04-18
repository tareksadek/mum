import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the modes as a TypeScript type for better type-checking.
type AppMode = 'edit' | 'view';

// Define the initial state with a 'mode' field.
type AppState = {
  mode: AppMode;
  didChange: boolean;
};

const initialState: AppState = {
  mode: 'view', // Default mode
  didChange: false,
};

const appMode = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Action to switch between 'edit' and 'view' modes.
    toggleMode(state) {
      state.mode = state.mode === 'view' ? 'edit' : 'view';
      state.didChange = true;
    },
    // Action to set a specific mode. This might be useful if you want to set the mode explicitly rather than toggling.
    setMode(state, action: PayloadAction<AppMode>) {
      state.mode = action.payload;
      state.didChange = true;
    },
  },
});

export const { toggleMode, setMode } = appMode.actions;

export default appMode.reducer;
