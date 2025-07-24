// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // usa localStorage
import { combineReducers } from 'redux';

import authReducer from './slices/authSlice';
import categorySelectionReducer  from './slices/categorySelectionSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  category: categorySelectionReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['category'], // ← solo esta parte del estado se persistirá
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // necesario por redux-persist
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
