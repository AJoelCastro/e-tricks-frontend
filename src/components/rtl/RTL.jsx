'use client';

import { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
// EMOTION
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
// RTL STYLISH
import { prefixer } from 'stylis';
import stylisRTLPlugin from 'stylis-plugin-rtl';
export default function RTL({
  children
}) {
  const theme = useTheme();
  useEffect(() => {
    document.dir = theme.direction;
  }, [theme.direction]);
  const cacheRTL = createCache({
    key: theme.direction === 'rtl' ? 'rtl' : 'css',
    stylisPlugins: theme.direction === 'rtl' ? [prefixer, stylisRTLPlugin] : []
  });
  cacheRTL.compat = true;
  return <CacheProvider value={cacheRTL}>{children}</CacheProvider>;
}