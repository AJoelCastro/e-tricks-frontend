// store/slices/categorySelectionSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MarcaSelectionState {
  marcaId: string;
  productCategoryId: string;
}

const initialState: MarcaSelectionState = {
  marcaId: '',
  productCategoryId: '',
};

const marcaSelectionSlice = createSlice({
  name: 'marcaSelection',
  initialState,
  reducers: {
    setMarcaId(state, action: PayloadAction<string>) {
      state.marcaId = action.payload;
    },
    setProductCategoryId(state, action: PayloadAction<string>) {
      state.productCategoryId = action.payload;
    },
    clearSelection(state) {
      state.marcaId = '';
      state.productCategoryId = '';
    },
  },
});

export const {
  setMarcaId,
  setProductCategoryId,
  clearSelection,
} = marcaSelectionSlice.actions;

export default marcaSelectionSlice.reducer;
