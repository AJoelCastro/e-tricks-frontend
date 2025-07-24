// store/slices/categorySelectionSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CategorySelectionState {
  categoryId: string;
  subcategoryId: string;
  productCategoryId: string;
}

const initialState: CategorySelectionState = {
  categoryId: '',
  subcategoryId: '',
  productCategoryId: '',
};

const categorySelectionSlice = createSlice({
  name: 'categorySelection',
  initialState,
  reducers: {
    setCategoryId(state, action: PayloadAction<string>) {
      state.categoryId = action.payload;
    },
    setSubcategoryId(state, action: PayloadAction<string>) {
      state.subcategoryId = action.payload;
    },
    setProductCategoryId(state, action: PayloadAction<string>) {
      state.productCategoryId = action.payload;
    },
    clearSelection(state) {
      state.categoryId = '';
      state.subcategoryId = '';
      state.productCategoryId = '';
    },
  },
});

export const {
  setCategoryId,
  setSubcategoryId,
  setProductCategoryId,
  clearSelection,
} = categorySelectionSlice.actions;

export default categorySelectionSlice.reducer;
