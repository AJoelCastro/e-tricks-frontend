'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { esES } from '@clerk/localizations';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import ThemeProvider1 from '@/theme/theme-provider';
import AuthTokenHandler from '@/hooks/AuthTokenHandler';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider localization={esES}>
      <ReduxProvider store={store}>
        <AuthTokenHandler>
          <ThemeProvider1>
            {children}
          </ThemeProvider1>
        </AuthTokenHandler>
      </ReduxProvider>
    </ClerkProvider>
  );
}
