import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userId: string | null;
  isAdmin: boolean;
}

const initialState: AuthState = {
  userId: null,
  isAdmin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{userId: string, isAdmin: boolean }>) {
      state.userId = action.payload.userId;
      state.isAdmin = action.payload.isAdmin;
    },
    clearAuth(state) {
      state.userId = null;
      state.isAdmin = false;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
