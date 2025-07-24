'use client';
import { Provider as ReduxProvider } from 'react-redux';
import { store, persistor } from '@/store';
import ThemeProvider1 from '@/theme/theme-provider';
import AuthTokenHandler from '@/hooks/AuthTokenHandler';
import { PersistGate } from 'redux-persist/integration/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthTokenHandler>
            <ThemeProvider1>
              {children}
            </ThemeProvider1>
          </AuthTokenHandler>
        </PersistGate>
      </ReduxProvider>
  );
}
